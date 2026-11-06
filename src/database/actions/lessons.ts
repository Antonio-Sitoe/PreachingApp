import { and, asc, desc, eq, inArray, isNotNull, isNull, ne } from 'drizzle-orm';
import { db } from '../db';
import {
  type LessonAdvance,
  lessonAdvances,
  type LessonProgress,
  lessonProgress,
  milestones,
  stageChanges,
  students,
  visits,
} from '../schemas';
import { currentLesson } from '@/utils/study/parts';
import { undoBlockReason } from '@/utils/study/lesson-edit';
import type {
  AdvanceInput,
  AdvanceResult,
  AdvanceUndoData,
  LessonDetail,
  Transaction,
  UndoableAdvance,
} from '../@types';
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
    const undo: AdvanceUndoData = {
      createdIds: [],
      closedIds: [],
      goalDone: null,
      stageChangeId: null,
      fromStage: null,
    };

    const insert = (lesson: number, completed: boolean, goalDone = false) => {
      const row = tx
        .insert(lessonProgress)
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
        .returning()
        .get();
      undo.createdIds.push(row.id);
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
    const studyStarted = Boolean(student && REVISIT_STAGES.includes(student.stage));
    if (student && studyStarted) {
      tx.update(students)
        .set({ stage: 'study_started', updatedAt: timestamp, syncStatus: 'pending' })
        .where(eq(students.id, input.studentId))
        .run();
      const change = tx
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
      undo.stageChangeId = change.id;
      undo.fromStage = student.stage;
    }

    const changed =
      undo.createdIds.length > 0 ||
      undo.closedIds.length > 0 ||
      undo.goalDone !== null ||
      undo.stageChangeId !== null;
    const advance = changed
      ? tx
          .insert(lessonAdvances)
          .values({
            studentId: input.studentId,
            visitId: input.visitId,
            lesson: input.lesson,
            previousVisitLesson: input.previousVisitLesson,
            undoData: JSON.stringify(undo),
            createdAt: timestamp,
            updatedAt: timestamp,
            syncStatus: 'pending',
          })
          .returning()
          .get()
      : null;

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
      advanceId: advance?.id ?? null,
    };
  });
}

type Reader = Pick<Transaction, 'select'>;

function latestAdvance(reader: Reader, visitId: string): LessonAdvance | undefined {
  return reader
    .select()
    .from(lessonAdvances)
    .where(
      and(
        eq(lessonAdvances.visitId, visitId),
        isNull(lessonAdvances.undoneAt),
        isNull(lessonAdvances.deletedAt)
      )
    )
    .orderBy(desc(lessonAdvances.createdAt))
    .limit(1)
    .get();
}

function blockReason(reader: Reader, advance: LessonAdvance) {
  const activeAdvances = reader
    .select({ createdAt: lessonAdvances.createdAt })
    .from(lessonAdvances)
    .where(
      and(
        eq(lessonAdvances.studentId, advance.studentId),
        isNull(lessonAdvances.undoneAt),
        isNull(lessonAdvances.deletedAt)
      )
    )
    .all();
  const otherVisits = reader
    .select({ lessonNumber: visits.lessonNumber })
    .from(visits)
    .where(
      and(
        eq(visits.studentId, advance.studentId),
        ne(visits.id, advance.visitId),
        isNotNull(visits.lessonNumber),
        isNull(visits.deletedAt)
      )
    )
    .all();
  return undoBlockReason(
    advance,
    activeAdvances,
    otherVisits.map((visit) => visit.lessonNumber)
  );
}

function getUndoableAdvance(visitId: string): UndoableAdvance | null {
  const advance = latestAdvance(db, visitId);
  if (!advance) return null;
  const { createdIds } = JSON.parse(advance.undoData) as AdvanceUndoData;
  const created =
    createdIds.length > 0
      ? db
          .select({ lessonNumber: lessonProgress.lessonNumber, notes: lessonProgress.notes })
          .from(lessonProgress)
          .where(inArray(lessonProgress.id, createdIds))
          .all()
      : [];
  return {
    advance,
    blocked: blockReason(db, advance),
    lessonsWithNotes: created.filter((row) => row.notes).map((row) => row.lessonNumber),
  };
}

function revert(tx: Transaction, advance: LessonAdvance, restoreVisitLesson: boolean): void {
  const timestamp = now();
  const pending = { updatedAt: timestamp, syncStatus: 'pending' } as const;
  const undo = JSON.parse(advance.undoData) as AdvanceUndoData;

  if (undo.createdIds.length > 0) {
    tx.update(lessonProgress)
      .set({ ...pending, deletedAt: timestamp })
      .where(inArray(lessonProgress.id, undo.createdIds))
      .run();
  }
  if (undo.closedIds.length > 0) {
    tx.update(lessonProgress)
      .set({ ...pending, completedAt: null })
      .where(inArray(lessonProgress.id, undo.closedIds))
      .run();
  }
  if (undo.goalDone) {
    tx.update(lessonProgress)
      .set({ ...pending, goalDone: undo.goalDone.previous })
      .where(eq(lessonProgress.id, undo.goalDone.id))
      .run();
  }
  if (undo.stageChangeId && undo.fromStage) {
    const restored = tx
      .update(students)
      .set({ ...pending, stage: undo.fromStage })
      .where(and(eq(students.id, advance.studentId), eq(students.stage, 'study_started')))
      .returning({ id: students.id })
      .all();
    if (restored.length > 0) {
      tx.update(stageChanges)
        .set({ ...pending, deletedAt: timestamp })
        .where(eq(stageChanges.id, undo.stageChangeId))
        .run();
    }
  }
  if (restoreVisitLesson) {
    tx.update(visits)
      .set({ ...pending, lessonNumber: advance.previousVisitLesson })
      .where(eq(visits.id, advance.visitId))
      .run();
  }
  tx.update(lessonAdvances)
    .set({ ...pending, undoneAt: timestamp })
    .where(eq(lessonAdvances.id, advance.id))
    .run();
}

/** Usa a transacção de quem chama, para apagar a visita e desfazer o avanço de uma só vez. */
export function undoVisitAdvance(tx: Transaction, visitId: string): boolean {
  const advance = latestAdvance(tx, visitId);
  if (!advance || blockReason(tx, advance)) return false;
  revert(tx, advance, false);
  return true;
}

function undoAdvance(advanceId: string, options: { restoreVisitLesson: boolean }): boolean {
  return db.transaction((tx) => {
    const advance = tx
      .select()
      .from(lessonAdvances)
      .where(
        and(
          eq(lessonAdvances.id, advanceId),
          isNull(lessonAdvances.undoneAt),
          isNull(lessonAdvances.deletedAt)
        )
      )
      .get();
    if (!advance || blockReason(tx, advance)) return false;
    revert(tx, advance, options.restoreVisitLesson);
    return true;
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
  getUndoableAdvance,
  undoAdvance,
  getDetail,
  update,
  resolveQuestion,
  saveReview,
  getReviewedParts,
};
