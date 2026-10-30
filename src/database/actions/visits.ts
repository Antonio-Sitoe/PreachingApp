import { and, desc, eq, inArray, isNull, lte } from 'drizzle-orm';
import dayjs from 'dayjs';
import { db } from '../db';
import { appointments, type Visit, type VisitOutcome, visits } from '../schemas';

export type NextVisitInput = {
  date: Date;
  /** HH:mm */
  time: string | null;
  remindMinutesBefore: number | null;
};

export type VisitInput = {
  studentId: string;
  visitedAt: Date;
  outcome: VisitOutcome;
  notes?: string;
  scriptures?: string[];
  pendingQuestion?: string;
  promisedToBring?: string;
  lessonNumber?: number | null;
  stoppedAtPoint?: string;
  next?: NextVisitInput | null;
};

const now = () => new Date().toISOString();

export function parseScriptures(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Grava a visita, dá por cumpridas as marcações por cumprir até esse dia
 * e, com `next`, marca a próxima.
 */
async function create(input: VisitInput): Promise<Visit> {
  try {
    const timestamp = now();
    const scriptures = (input.scriptures ?? []).map((text) => text.trim()).filter(Boolean);
    // O driver do expo-sqlite é síncrono: sem await dentro da transacção.
    return db.transaction((tx) => {
      const visit = tx
        .insert(visits)
        .values({
          studentId: input.studentId,
          visitedAt: input.visitedAt.toISOString(),
          outcome: input.outcome,
          notes: input.notes?.trim() || null,
          scriptures: scriptures.length > 0 ? JSON.stringify(scriptures) : null,
          pendingQuestion: input.pendingQuestion?.trim() || null,
          promisedToBring: input.promisedToBring?.trim() || null,
          lessonNumber: input.lessonNumber ?? null,
          stoppedAtPoint: input.lessonNumber ? input.stoppedAtPoint?.trim() || null : null,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();

      tx.update(appointments)
        .set({
          status: input.outcome === 'met' ? 'done' : 'postponed',
          visitId: visit.id,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .where(
          and(
            eq(appointments.studentId, input.studentId),
            eq(appointments.status, 'pending'),
            isNull(appointments.deletedAt),
            lte(appointments.scheduledAt, dayjs(input.visitedAt).endOf('day').toISOString())
          )
        )
        .run();

      if (input.next) {
        tx.insert(appointments)
          .values({
            studentId: input.studentId,
            scheduledAt: dayjs(input.next.date).startOf('day').toISOString(),
            timeOfDay: 'any',
            time: input.next.time,
            status: 'pending',
            remindMinutesBefore: input.next.remindMinutesBefore,
            createdAt: timestamp,
            updatedAt: timestamp,
            syncStatus: 'pending',
          })
          .run();
      }

      return visit;
    });
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
}

async function getByStudent(studentId: string): Promise<Visit[]> {
  return db
    .select()
    .from(visits)
    .where(and(eq(visits.studentId, studentId), isNull(visits.deletedAt)))
    .orderBy(desc(visits.visitedAt));
}

async function getLastMet(studentIds: string[]): Promise<Map<string, Visit>> {
  if (studentIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(visits)
    .where(
      and(
        inArray(visits.studentId, studentIds),
        eq(visits.outcome, 'met'),
        isNull(visits.deletedAt)
      )
    )
    .orderBy(desc(visits.visitedAt));
  const last = new Map<string, Visit>();
  for (const row of rows) if (!last.has(row.studentId)) last.set(row.studentId, row);
  return last;
}

export const visitsActions = {
  create,
  getByStudent,
  getLastMet,
};
