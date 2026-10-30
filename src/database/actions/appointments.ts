import dayjs from 'dayjs';
import { and, asc, desc, eq, gte, inArray, isNotNull, isNull, lt } from 'drizzle-orm';
import { db } from '../db';
import { appointments, students, visits } from '../schemas';

/** Os dias (YYYY-MM-DD) do mês com marcações por cumprir. */
async function getScheduledDays(month: Date): Promise<string[]> {
  const start = dayjs(month).startOf('month');
  const rows = await db
    .select({ scheduledAt: appointments.scheduledAt })
    .from(appointments)
    .where(
      and(
        eq(appointments.status, 'pending'),
        isNull(appointments.deletedAt),
        gte(appointments.scheduledAt, start.toISOString()),
        lt(appointments.scheduledAt, start.add(1, 'month').toISOString())
      )
    );
  return [...new Set(rows.map((row) => dayjs(row.scheduledAt).format('YYYY-MM-DD')))];
}

export type ReminderTarget = {
  appointmentId: string;
  studentId: string;
  studentName: string;
  studentGender: (typeof students.$inferSelect)['gender'];
  scheduledAt: string;
  /** HH:mm */
  time: string;
  remindMinutesBefore: number;
  lastLesson: number | null;
  promisedToBring: string | null;
};

/**
 * As marcações por cumprir com hora e aviso, de estudantes activos, a partir de hoje.
 * Juntam a lição e o "Prometi levar" da última visita em que o encontraram.
 */
async function getReminderTargets(limit = 50): Promise<ReminderTarget[]> {
  const rows = await db
    .select({
      appointmentId: appointments.id,
      studentId: appointments.studentId,
      studentName: students.displayName,
      studentGender: students.gender,
      scheduledAt: appointments.scheduledAt,
      time: appointments.time,
      remindMinutesBefore: appointments.remindMinutesBefore,
    })
    .from(appointments)
    .innerJoin(students, eq(appointments.studentId, students.id))
    .where(
      and(
        eq(appointments.status, 'pending'),
        isNull(appointments.deletedAt),
        isNotNull(appointments.time),
        isNotNull(appointments.remindMinutesBefore),
        gte(appointments.scheduledAt, dayjs().startOf('day').subtract(1, 'day').toISOString()),
        eq(students.status, 'active'),
        isNull(students.deletedAt)
      )
    )
    .orderBy(asc(appointments.scheduledAt), asc(appointments.time))
    .limit(limit);

  const studentIds = [...new Set(rows.map((row) => row.studentId))];
  const lastVisits = new Map<
    string,
    { lessonNumber: number | null; promisedToBring: string | null }
  >();
  if (studentIds.length > 0) {
    const met = await db
      .select({
        studentId: visits.studentId,
        lessonNumber: visits.lessonNumber,
        promisedToBring: visits.promisedToBring,
      })
      .from(visits)
      .where(
        and(
          inArray(visits.studentId, studentIds),
          eq(visits.outcome, 'met'),
          isNull(visits.deletedAt)
        )
      )
      .orderBy(desc(visits.visitedAt));
    for (const visit of met)
      if (!lastVisits.has(visit.studentId)) lastVisits.set(visit.studentId, visit);
  }

  return rows.map((row) => ({
    ...row,
    time: row.time as string,
    remindMinutesBefore: row.remindMinutesBefore as number,
    lastLesson: lastVisits.get(row.studentId)?.lessonNumber ?? null,
    promisedToBring: lastVisits.get(row.studentId)?.promisedToBring ?? null,
  }));
}

export type ScheduleInput = {
  date: Date;
  /** HH:mm */
  time: string | null;
  remindMinutesBefore: number | null;
};

async function schedule(studentId: string, input: ScheduleInput) {
  const timestamp = new Date().toISOString();
  const rows = await db
    .insert(appointments)
    .values({
      studentId,
      scheduledAt: dayjs(input.date).startOf('day').toISOString(),
      timeOfDay: 'any',
      time: input.time,
      status: 'pending',
      remindMinutesBefore: input.time ? input.remindMinutesBefore : null,
      createdAt: timestamp,
      updatedAt: timestamp,
      syncStatus: 'pending',
    })
    .returning();
  return rows[0];
}

/** Muda o dia da marcação e mantém a hora. Devolve o dia antigo, para se poder desfazer. */
async function reschedule(id: string, date: Date): Promise<string | undefined> {
  const current = await db
    .select({ scheduledAt: appointments.scheduledAt })
    .from(appointments)
    .where(eq(appointments.id, id));
  if (!current[0]) return undefined;
  await db
    .update(appointments)
    .set({
      scheduledAt: dayjs(date).startOf('day').toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    })
    .where(eq(appointments.id, id));
  return current[0].scheduledAt;
}

export const appointmentsActions = {
  getScheduledDays,
  schedule,
  reschedule,
  getReminderTargets,
};
