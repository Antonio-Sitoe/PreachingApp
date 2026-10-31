import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { db } from '../db';
import {
  type LessonProgress,
  lessonProgress,
  milestones,
  type StageChange,
  stageChanges,
  students,
  visits,
} from '../schemas';

export type AdvanceInput = {
  studentId: string;
  lesson: number;
  date: Date;
  /** "Tente o seguinte" da lição que fica fechada agora. */
  previousGoalDone?: boolean;
  closeSkipped?: boolean;
};

export type AdvanceResult = {
  startedLesson: number | null;
  closedLessons: number[];
  /** Parte cuja última lição ficou fechada agora: 1 a 4. */
  completedPart: number | null;
  undo: AdvanceUndo;
};

export type AdvanceUndo = {
  createdIds: string[];
  closedIds: string[];
  goalDone: { id: string; previous: boolean } | null;
  stageChange: StageChange | null;
};

export type LessonDetail = {
  row: LessonProgress | null;
  visitCount: number;
  questions: { visitId: string; question: string; askedAt: string }[];
};

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
    const undo: AdvanceUndo = { createdIds: [], closedIds: [], goalDone: null, stageChange: null };
    const closedLessons: number[] = [];

    const insert = (lesson: number, completed: boolean) => {
      const row = tx
        .insert(lessonProgress)
        .values({
          studentId: input.studentId,
          lessonNumber: lesson,
          startedAt: date,
          completedAt: completed ? date : null,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();
      undo.createdIds.push(row.id);
      return row;
    };

    const known = new Set(rows.map((row) => row.lessonNumber));
    const highest = rows.length > 0 ? Math.max(...rows.map((row) => row.lessonNumber)) : null;
    const startedLesson = known.has(input.lesson) ? null : input.lesson;
    if (startedLesson) insert(input.lesson, false);

    if (input.closeSkipped && highest !== null) {
      for (let lesson = highest + 1; lesson < input.lesson; lesson += 1) {
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
      undo.closedIds.push(row.id);
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
      undo.goalDone = { id: previous.id, previous: previous.goalDone };
    }

    const student = tx
      .select({ stage: students.stage })
      .from(students)
      .where(eq(students.id, input.studentId))
      .get();
    if (student && REVISIT_STAGES.includes(student.stage)) {
      tx.update(students)
        .set({ stage: 'study_started', updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(students.id, input.studentId))
        .run();
      undo.stageChange = tx
        .insert(stageChanges)
        .values({
          studentId: input.studentId,
          fromStage: student.stage,
          toStage: 'study_started',
          changedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();
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
      undo,
    };
  });
}

function undoAdvance(undo: AdvanceUndo): void {
  const timestamp = now();
  db.transaction((tx) => {
    if (undo.createdIds.length > 0) {
      tx.update(lessonProgress)
        .set({ deletedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
        .where(inArray(lessonProgress.id, undo.createdIds))
        .run();
    }
    if (undo.closedIds.length > 0) {
      tx.update(lessonProgress)
        .set({ completedAt: null, updatedAt: timestamp, syncStatus: 'pending' })
        .where(inArray(lessonProgress.id, undo.closedIds))
        .run();
    }
    if (undo.goalDone) {
      tx.update(lessonProgress)
        .set({ goalDone: undo.goalDone.previous, updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(lessonProgress.id, undo.goalDone.id))
        .run();
    }
    const change = undo.stageChange;
    if (change?.fromStage) {
      tx.update(students)
        .set({ stage: change.fromStage, updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(students.id, change.studentId))
        .run();
      tx.update(stageChanges)
        .set({ deletedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(stageChanges.id, change.id))
        .run();
    }
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
    occurredAt: date.toISOString().slice(0, 10),
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
  undoAdvance,
  getDetail,
  update,
  resolveQuestion,
  saveReview,
  getReviewedParts,
};
