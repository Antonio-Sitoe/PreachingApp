import { and, asc, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import {
  type LessonProgress,
  lessonProgress,
  milestones,
  stageChanges,
  students,
  visits,
} from '../schemas';
import { currentLesson } from '@/utils/study/parts';
import type { AdvanceInput, AdvanceResult, LessonDetail } from '../@types';
import { toDayString } from '@/utils/dates';

const PART_ENDS: Record<number, number> = { 12: 1, 33: 2, 47: 3, 60: 4 };
const REVISIT_STAGES = ['first_contact', 'return_visit'];

const now = () => new Date().toISOString();

async function getByStudent(studentId: string): Promise<LessonProgress[]> {
  return db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.studentId, studentId), isNull(lessonProgress.deletedAt)))
    .orderBy(asc(lessonProgress.lessonNumber));
}

function advance(input: AdvanceInput): AdvanceResult {
  const timestamp = now();
  const date = input.date.toISOString();
  // O driver do expo-sqlite é síncrono: sem await dentro da transacção.
  return db.transaction((tx) => {
    const rows = tx
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.studentId, input.studentId), isNull(lessonProgress.deletedAt)))
      .all();
    const closedLessons: number[] = [];

    const insert = (lesson: number, completed: boolean, goalDone = false) => {
      tx.insert(lessonProgress)
        .values({
          studentId: input.studentId,
          lessonNumber: lesson,
          startedAt: date,
          completedAt: completed ? date : null,
          goalDone,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .run();
    };

    const known = new Set(rows.map((row) => row.lessonNumber));
    const current = currentLesson(rows);
    const startedLesson = known.has(input.lesson) ? null : input.lesson;
    if (startedLesson) insert(input.lesson, false);

    const advancing = current !== null && current < input.lesson;
    if (advancing && !known.has(current)) {
      insert(current, true, input.previousGoalDone ?? false);
      closedLessons.push(current);
    }

    if (advancing && input.closeSkipped) {
      for (let lesson = current + 1; lesson < input.lesson; lesson += 1) {
        insert(lesson, true);
        closedLessons.push(lesson);
      }
    }

    const toClose = rows
      .filter((row) => !row.completedAt && row.lessonNumber < input.lesson)
      .sort((a, b) => a.lessonNumber - b.lessonNumber);
    for (const row of toClose) {
      tx.update(lessonProgress)
        .set({ completedAt: date, updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(lessonProgress.id, row.id))
        .run();
      closedLessons.push(row.lessonNumber);
    }

    const previous = toClose[toClose.length - 1];
    if (
      previous &&
      input.previousGoalDone !== undefined &&
      previous.goalDone !== input.previousGoalDone
    ) {
      tx.update(lessonProgress)
        .set({ goalDone: input.previousGoalDone, updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(lessonProgress.id, previous.id))
        .run();
    }

    const student = tx
      .select({ stage: students.stage })
      .from(students)
      .where(eq(students.id, input.studentId))
      .get();
    const studyStarted = Boolean(student && REVISIT_STAGES.includes(student.stage));
    if (student && studyStarted) {
      tx.update(students)
        .set({ stage: 'study_started', updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(students.id, input.studentId))
        .run();
      tx.insert(stageChanges)
        .values({
          studentId: input.studentId,
          fromStage: student.stage,
          toStage: 'study_started',
          changedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .run();
    }

    const completedPart =
      closedLessons
        .map((lesson) => PART_ENDS[lesson])
        .filter(Boolean)
        .pop() ?? null;

    return {
      startedLesson,
      closedLessons: closedLessons.sort((a, b) => a - b),
      completedPart,
      studyStarted,
    };
  });
}

async function getDetail(studentId: string, lesson: number): Promise<LessonDetail> {
  const [rows, lessonVisits] = await Promise.all([
    db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.studentId, studentId),
          eq(lessonProgress.lessonNumber, lesson),
          isNull(lessonProgress.deletedAt)
        )
      ),
    db
      .select()
      .from(visits)
      .where(
        and(
          eq(visits.studentId, studentId),
          eq(visits.lessonNumber, lesson),
          isNull(visits.deletedAt)
        )
      )
      .orderBy(asc(visits.visitedAt)),
  ]);
  return {
    row: rows[0] ?? null,
    visitCount: lessonVisits.length,
    questions: lessonVisits
      .filter((visit) => visit.pendingQuestion && !visit.questionResolvedAt)
      .map((visit) => ({
        visitId: visit.id,
        question: visit.pendingQuestion as string,
        askedAt: visit.visitedAt,
      })),
  };
}

async function update(
  id: string,
  data: Partial<Pick<LessonProgress, 'goalDone' | 'notes' | 'completedAt'>>
): Promise<void> {
  await db
    .update(lessonProgress)
    .set({ ...data, updatedAt: now(), syncStatus: 'pending' })
    .where(eq(lessonProgress.id, id));
}

async function resolveQuestion(visitId: string): Promise<void> {
  const timestamp = now();
  await db
    .update(visits)
    .set({ questionResolvedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
    .where(eq(visits.id, visitId));
}

async function saveReview(
  studentId: string,
  part: number,
  date: Date,
  note: string
): Promise<void> {
  const timestamp = now();
  await db.insert(milestones).values({
    studentId,
    type: 'part_review',
    label: `Revisão da parte ${part}`,
    note: note.trim() || null,
    occurredAt: toDayString(date),
    createdAt: timestamp,
    updatedAt: timestamp,
    syncStatus: 'pending',
  });
}

/** As partes com revisão guardada como marco: 1 a 4. */
async function getReviewedParts(studentId: string): Promise<number[]> {
  const rows = await db
    .select({ label: milestones.label })
    .from(milestones)
    .where(
      and(
        eq(milestones.studentId, studentId),
        eq(milestones.type, 'part_review'),
        isNull(milestones.deletedAt)
      )
    );
  return rows
    .map((row) => Number(row.label.match(/\d+/)?.[0]))
    .filter((part) => Number.isInteger(part));
}

export const lessonsActions = {
  getByStudent,
  advance,
  getDetail,
  update,
  resolveQuestion,
  saveReview,
  getReviewedParts,
};
