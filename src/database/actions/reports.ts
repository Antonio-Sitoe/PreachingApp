import { minutesToHoursAndMinutes } from '@/utils/dates';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import dayjs from 'dayjs';
import { db } from '../db';
import { type NewReport, type Report, reports } from '../schemas/reports';

export type ReportInput = {
  date: string;
  hours: number;
  minutes: number;
  students: number;
  comments?: string | null;
};

export type ReportTotals = {
  hours: number;
  minutes: number;
  students: number;
  time: string;
  isParticipated: boolean;
};

export type ReportMonthGroup = {
  month: number;
  reports: Report[];
};

export type ReportYearGroup = {
  year: number;
  months: ReportMonthGroup[];
};

function nowIso() {
  return new Date().toISOString();
}

function partsOf(date: string) {
  const parsed = dayjs(date);
  return {
    date: parsed.format('YYYY-MM-DD'),
    year: parsed.year(),
    month: parsed.month() + 1,
    day: parsed.date(),
  };
}

function totalsFrom(row: { hours: number; minutes: number; students: number; count?: number }): ReportTotals {
  return {
    hours: row.hours,
    minutes: row.minutes,
    students: row.students,
    time: minutesToHoursAndMinutes(row.hours, row.minutes),
    isParticipated: (row.count ?? 0) > 0,
  };
}

async function findByDate(date: string) {
  return (
    await db
      .select()
      .from(reports)
      .where(and(eq(reports.date, date), isNull(reports.deletedAt)))
      .limit(1)
  )[0];
}

async function create(input: ReportInput) {
  const when = partsOf(input.date);
  const existing = await findByDate(when.date);
  const now = nowIso();

  if (existing) {
    const updated = await db
      .update(reports)
      .set({
        hours: existing.hours + input.hours,
        minutes: existing.minutes + input.minutes,
        students: existing.students + input.students,
        comments: input.comments?.trim() || existing.comments,
        updatedAt: now,
        syncStatus: 'pending',
      })
      .where(eq(reports.id, existing.id))
      .returning();
    return updated[0];
  }

  const created = await db
    .insert(reports)
    .values({
      ...when,
      hours: input.hours,
      minutes: input.minutes,
      students: input.students,
      comments: input.comments?.trim() || null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
    })
    .returning();
  return created[0];
}

async function update(id: string, input: Partial<ReportInput>) {
  const when = input.date ? partsOf(input.date) : undefined;
  const patch: Partial<NewReport> = {
    updatedAt: nowIso(),
    syncStatus: 'pending',
  };
  if (when) Object.assign(patch, when);
  if (input.hours !== undefined) patch.hours = input.hours;
  if (input.minutes !== undefined) patch.minutes = input.minutes;
  if (input.students !== undefined) patch.students = input.students;
  if (input.comments !== undefined) patch.comments = input.comments?.trim() || null;

  const updated = await db.update(reports).set(patch).where(eq(reports.id, id)).returning();
  return updated[0];
}

async function remove(id: string) {
  const updated = await db
    .update(reports)
    .set({ deletedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(reports.id, id))
    .returning();
  return updated[0];
}

async function getGlobalStates(month: number, year: number) {
  const [row] = await db
    .select({
      hours: sql<number>`coalesce(sum(${reports.hours}), 0)`,
      minutes: sql<number>`coalesce(sum(${reports.minutes}), 0)`,
      students: sql<number>`coalesce(sum(${reports.students}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(reports)
    .where(and(eq(reports.month, month), eq(reports.year, year), isNull(reports.deletedAt)));

  return totalsFrom(row ?? { hours: 0, minutes: 0, students: 0, count: 0 });
}

async function getByYear(year: number) {
  const [row] = await db
    .select({
      hours: sql<number>`coalesce(sum(${reports.hours}), 0)`,
      minutes: sql<number>`coalesce(sum(${reports.minutes}), 0)`,
      students: sql<number>`coalesce(sum(${reports.students}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(reports)
    .where(and(eq(reports.year, year), isNull(reports.deletedAt)));

  return totalsFrom(row ?? { hours: 0, minutes: 0, students: 0, count: 0 });
}

function groupByYearAndMonth(rows: Report[]): ReportYearGroup[] {
  const byYear = new Map<number, Map<number, Report[]>>();

  for (const row of rows) {
    const months = byYear.get(row.year) ?? new Map<number, Report[]>();
    const list = months.get(row.month) ?? [];
    list.push(row);
    months.set(row.month, list);
    byYear.set(row.year, months);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([month, monthReports]) => ({
          month,
          reports: monthReports.sort((a, b) => b.day - a.day),
        })),
    }));
}

async function getGrouped() {
  const rows = await db
    .select()
    .from(reports)
    .where(isNull(reports.deletedAt))
    .orderBy(desc(reports.year), desc(reports.month), desc(reports.day));
  return groupByYearAndMonth(rows);
}

async function getPage(page: number, limit: number) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports)
    .where(isNull(reports.deletedAt));
  const total = count ?? 0;
  const rows = await db
    .select()
    .from(reports)
    .where(isNull(reports.deletedAt))
    .orderBy(desc(reports.year), desc(reports.month), desc(reports.day))
    .limit(limit)
    .offset(page * limit);

  return { data: rows, totalPage: Math.ceil(total / limit) };
}

export const reportsActions = {
  create,
  update,
  remove,
  getGlobalStates,
  getByYear,
  getGrouped,
  getPage,
};
