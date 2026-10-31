import { and, eq, gte, isNotNull, isNull, lt } from 'drizzle-orm';
import dayjs from 'dayjs';
import { db } from '../db';
import { type MonthlyReport, monthlyReports } from '../schemas/monthly-reports';
import { students } from '../schemas/students';
import { timeEntries } from '../schemas/time-entries';
import type { PublisherType } from '../schemas/users';
import { visits } from '../schemas/visits';

export type MonthReport = {
  year: number;
  month: number;
  participated: boolean;
  participatedAuto: boolean;
  bibleStudies: number;
  studiesAuto: number;
  studyNames: string[];
  minutes: number;
  sentAt: string | null;
  sentHours: number | null;
};

export type SentReport = {
  publisherType: PublisherType;
  participated: boolean;
  bibleStudies: number;
  hours: number;
};

function nowIso() {
  return new Date().toISOString();
}

function monthRange(year: number, month: number) {
  const start = dayjs(new Date(year, month - 1, 1));
  return { from: start.toISOString(), to: start.add(1, 'month').toISOString() };
}

export const monthKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, '0')}`;

async function getRow(year: number, month: number): Promise<MonthlyReport | undefined> {
  return (
    await db
      .select()
      .from(monthlyReports)
      .where(
        and(
          eq(monthlyReports.year, year),
          eq(monthlyReports.month, month),
          isNull(monthlyReports.deletedAt)
        )
      )
      .limit(1)
  )[0];
}

function merge(
  year: number,
  month: number,
  activity: { visits: number; studyStudents: string[]; minutes: number },
  row: MonthlyReport | undefined,
  studyNames: string[] = []
): MonthReport {
  const participatedAuto = activity.visits > 0 || activity.minutes > 0;
  const studiesAuto = activity.studyStudents.length;
  return {
    year,
    month,
    participatedAuto,
    participated: row?.participated ?? participatedAuto,
    studiesAuto,
    bibleStudies: row?.bibleStudies ?? studiesAuto,
    studyNames,
    minutes: activity.minutes,
    sentAt: row?.sentAt ?? null,
    sentHours: row?.sentAt ? row.hours : null,
  };
}

async function getMonth(year: number, month: number): Promise<MonthReport> {
  const { from, to } = monthRange(year, month);
  const monthVisits = await db
    .select({
      studentId: visits.studentId,
      lessonNumber: visits.lessonNumber,
      name: students.displayName,
    })
    .from(visits)
    .innerJoin(students, eq(students.id, visits.studentId))
    .where(and(gte(visits.visitedAt, from), lt(visits.visitedAt, to), isNull(visits.deletedAt)));
  const entries = await db
    .select({ minutes: timeEntries.minutes })
    .from(timeEntries)
    .where(
      and(
        gte(timeEntries.startedAt, from),
        lt(timeEntries.startedAt, to),
        isNull(timeEntries.deletedAt)
      )
    );

  const studies = new Map<string, string>();
  for (const visit of monthVisits) {
    if (visit.lessonNumber) studies.set(visit.studentId, visit.name.trim().split(/\s+/)[0]);
  }
  return merge(
    year,
    month,
    {
      visits: monthVisits.length,
      studyStudents: [...studies.keys()],
      minutes: entries.reduce((total, entry) => total + entry.minutes, 0),
    },
    await getRow(year, month),
    [...studies.values()]
  );
}

async function upsert(year: number, month: number, values: Partial<MonthlyReport>) {
  const now = nowIso();
  const existing = (
    await db
      .select()
      .from(monthlyReports)
      .where(and(eq(monthlyReports.year, year), eq(monthlyReports.month, month)))
      .limit(1)
  )[0];
  const patch = { ...values, deletedAt: null, updatedAt: now, syncStatus: 'pending' as const };
  if (existing) {
    await db.update(monthlyReports).set(patch).where(eq(monthlyReports.id, existing.id));
  } else {
    await db.insert(monthlyReports).values({ year, month, createdAt: now, ...patch });
  }
}

// null volta ao valor calculado das visitas.
function setParticipated(year: number, month: number, participated: boolean | null) {
  return upsert(year, month, { participated });
}

function setBibleStudies(year: number, month: number, bibleStudies: number | null) {
  return upsert(year, month, {
    bibleStudies: bibleStudies === null ? null : Math.max(0, bibleStudies),
  });
}

function markSent(year: number, month: number, report: SentReport) {
  return upsert(year, month, { ...report, sentAt: nowIso() });
}

function unmarkSent(year: number, month: number) {
  return upsert(year, month, { sentAt: null, hours: null });
}

// Do mês da primeira actividade até ao mês actual, do mais recente para o mais antigo.
async function getHistory(now = dayjs()): Promise<MonthReport[]> {
  const allVisits = await db
    .select({
      studentId: visits.studentId,
      visitedAt: visits.visitedAt,
      lessonNumber: visits.lessonNumber,
    })
    .from(visits)
    .where(isNull(visits.deletedAt));
  const allEntries = await db
    .select({ startedAt: timeEntries.startedAt, minutes: timeEntries.minutes })
    .from(timeEntries)
    .where(isNull(timeEntries.deletedAt));
  const rows = await db.select().from(monthlyReports).where(isNull(monthlyReports.deletedAt));

  const activity = new Map<string, { visits: number; studies: Set<string>; minutes: number }>();
  const at = (key: string) => {
    let value = activity.get(key);
    if (!value) {
      value = { visits: 0, studies: new Set(), minutes: 0 };
      activity.set(key, value);
    }
    return value;
  };
  for (const visit of allVisits) {
    const value = at(dayjs(visit.visitedAt).format('YYYY-MM'));
    value.visits += 1;
    if (visit.lessonNumber) value.studies.add(visit.studentId);
  }
  for (const entry of allEntries) {
    at(dayjs(entry.startedAt).format('YYYY-MM')).minutes += entry.minutes;
  }
  const byMonth = new Map(rows.map((row) => [monthKey(row.year, row.month), row]));

  const keys = [...activity.keys(), ...byMonth.keys()].sort();
  const current = now.startOf('month');
  let cursor = keys.length > 0 ? dayjs(`${keys[0]}-01`) : current;
  if (cursor.isAfter(current)) cursor = current;

  const history: MonthReport[] = [];
  while (!cursor.isAfter(current, 'month')) {
    const year = cursor.year();
    const month = cursor.month() + 1;
    const value = activity.get(monthKey(year, month));
    history.push(
      merge(
        year,
        month,
        {
          visits: value?.visits ?? 0,
          studyStudents: [...(value?.studies ?? [])],
          minutes: value?.minutes ?? 0,
        },
        byMonth.get(monthKey(year, month))
      )
    );
    cursor = cursor.add(1, 'month');
  }
  return history.reverse();
}

async function getSentMonths(): Promise<Set<string>> {
  const rows = await db
    .select({ year: monthlyReports.year, month: monthlyReports.month })
    .from(monthlyReports)
    .where(and(isNotNull(monthlyReports.sentAt), isNull(monthlyReports.deletedAt)));
  return new Set(rows.map((row) => monthKey(row.year, row.month)));
}

export const monthlyReportsActions = {
  getSentMonths,
  getMonth,
  getHistory,
  setParticipated,
  setBibleStudies,
  markSent,
  unmarkSent,
};
