import dayjs from 'dayjs';
import { and, asc, desc, eq, gte, inArray, isNull, lt } from 'drizzle-orm';
import { db } from '../db';
import {
  type Appointment,
  appointments,
  type Student,
  students,
  type Visit,
  visits,
} from '../schemas';
import { usersActions } from './users';

export type TodayItem = {
  student: Student;
  appointment: Appointment;
  lastMet: Visit | null;
};

export type OutOfRhythmItem = {
  student: Student;
  lastMet: Visit | null;
  /** Dias desde a data em que a visita devia ter acontecido pelo ritmo. */
  daysLate: number;
  /** Dias desde a última visita, ou desde o registo. */
  daysSince: number;
};

export type DoneTodayItem = {
  student: Student;
  visit: Visit;
  next: Appointment | null;
};

export type TodayData = {
  today: TodayItem[];
  overdue: (TodayItem & { daysLate: number })[];
  outOfRhythm: OutOfRhythmItem[];
  doneToday: DoneTodayItem[];
  tomorrow: TodayItem[];
  /** YYYY-MM-DD dos dias desta semana com marcações por cumprir. */
  weekDays: string[];
  studiesThisMonth: number;
  activeStudents: number;
};

const EMPTY: TodayData = {
  today: [],
  overdue: [],
  outOfRhythm: [],
  doneToday: [],
  tomorrow: [],
  weekDays: [],
  studiesThisMonth: 0,
  activeStudents: 0,
};

function byTime(a: TodayItem, b: TodayItem): number {
  return (a.appointment.time ?? '99:99').localeCompare(b.appointment.time ?? '99:99');
}

async function getToday(now = dayjs()): Promise<TodayData> {
  const user = await usersActions.getCurrent();
  if (!user) return EMPTY;

  const todayStart = now.startOf('day');
  const tomorrowStart = todayStart.add(1, 'day');
  const weekStart = todayStart.subtract((todayStart.day() + 6) % 7, 'day');
  const monthStart = todayStart.startOf('month');

  const active = await db
    .select()
    .from(students)
    .where(
      and(eq(students.userId, user.id), eq(students.status, 'active'), isNull(students.deletedAt))
    );
  if (active.length === 0) return EMPTY;
  const byId = new Map(active.map((student) => [student.id, student]));
  const ids = [...byId.keys()];

  const [pending, allVisits] = await Promise.all([
    db
      .select()
      .from(appointments)
      .where(
        and(
          inArray(appointments.studentId, ids),
          eq(appointments.status, 'pending'),
          isNull(appointments.deletedAt),
          lt(appointments.scheduledAt, weekStart.add(7, 'day').toISOString())
        )
      )
      .orderBy(asc(appointments.scheduledAt)),
    db
      .select()
      .from(visits)
      .where(and(inArray(visits.studentId, ids), isNull(visits.deletedAt)))
      .orderBy(desc(visits.visitedAt)),
  ]);

  const lastMet = new Map<string, Visit>();
  for (const visit of allVisits) {
    if (visit.outcome === 'met' && !lastMet.has(visit.studentId))
      lastMet.set(visit.studentId, visit);
  }

  const itemOf = (appointment: Appointment): TodayItem => ({
    student: byId.get(appointment.studentId) as Student,
    appointment,
    lastMet: lastMet.get(appointment.studentId) ?? null,
  });

  const today: TodayItem[] = [];
  const tomorrow: TodayItem[] = [];
  const overdueByStudent = new Map<string, TodayItem & { daysLate: number }>();
  for (const appointment of pending) {
    const day = dayjs(appointment.scheduledAt).startOf('day');
    if (day.isSame(todayStart, 'day')) today.push(itemOf(appointment));
    else if (day.isSame(tomorrowStart, 'day')) tomorrow.push(itemOf(appointment));
    else if (day.isBefore(todayStart)) {
      overdueByStudent.set(appointment.studentId, {
        ...itemOf(appointment),
        daysLate: todayStart.diff(day, 'day'),
      });
    }
  }

  const withPending = new Set(
    (
      await db
        .select({ studentId: appointments.studentId })
        .from(appointments)
        .where(
          and(
            inArray(appointments.studentId, ids),
            eq(appointments.status, 'pending'),
            isNull(appointments.deletedAt)
          )
        )
    ).map((row) => row.studentId)
  );

  const outOfRhythm: OutOfRhythmItem[] = [];
  for (const student of active) {
    if (withPending.has(student.id)) continue;
    const last = lastMet.get(student.id) ?? null;
    const since = dayjs(last?.visitedAt ?? student.createdAt).startOf('day');
    const due = since.add(student.rhythmDays, 'day');
    if (!due.isBefore(todayStart)) continue;
    outOfRhythm.push({
      student,
      lastMet: last,
      daysLate: todayStart.diff(due, 'day'),
      daysSince: todayStart.diff(since, 'day'),
    });
  }

  const visitsToday = allVisits.filter((visit) => dayjs(visit.visitedAt).isSame(todayStart, 'day'));
  const nextAfter = new Map<string, Appointment>();
  if (visitsToday.length > 0) {
    const upcoming = await db
      .select()
      .from(appointments)
      .where(
        and(
          inArray(
            appointments.studentId,
            visitsToday.map((visit) => visit.studentId)
          ),
          eq(appointments.status, 'pending'),
          isNull(appointments.deletedAt),
          gte(appointments.scheduledAt, tomorrowStart.toISOString())
        )
      )
      .orderBy(asc(appointments.scheduledAt));
    for (const row of upcoming)
      if (!nextAfter.has(row.studentId)) nextAfter.set(row.studentId, row);
  }

  const studiesThisMonth = new Set(
    allVisits
      .filter((visit) => visit.lessonNumber && !dayjs(visit.visitedAt).isBefore(monthStart))
      .map((visit) => visit.studentId)
  ).size;

  return {
    today: today.sort(byTime),
    overdue: [...overdueByStudent.values()].sort((a, b) => b.daysLate - a.daysLate),
    outOfRhythm: outOfRhythm.sort((a, b) => b.daysLate - a.daysLate),
    doneToday: visitsToday.map((visit) => ({
      student: byId.get(visit.studentId) as Student,
      visit,
      next: nextAfter.get(visit.studentId) ?? null,
    })),
    tomorrow: tomorrow.sort(byTime),
    weekDays: [
      ...new Set(
        pending
          .filter((appointment) => !dayjs(appointment.scheduledAt).isBefore(weekStart))
          .map((appointment) => dayjs(appointment.scheduledAt).format('YYYY-MM-DD'))
      ),
    ],
    studiesThisMonth,
    activeStudents: active.length,
  };
}

export const todayActions = {
  getToday,
};
