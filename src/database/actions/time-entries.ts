import { and, desc, eq, gte, isNull, lt } from 'drizzle-orm';
import dayjs from 'dayjs';
import { db } from '../db';
import { type NewTimeEntry, type TimeEntrySource, timeEntries } from '../schemas/time-entries';

export type TimeEntryInput = {
  startedAt: string;
  minutes: number;
  source: TimeEntrySource;
};

export type MonthStats = {
  minutes: number;
  daysOut: number;
};

function nowIso() {
  return new Date().toISOString();
}

// O mês é o do telemóvel; started_at está em UTC, por isso o intervalo também.
function monthRange(year: number, month: number) {
  const start = dayjs(new Date(year, month - 1, 1));
  return { from: start.toISOString(), to: start.add(1, 'month').toISOString() };
}

async function create(input: TimeEntryInput) {
  const now = nowIso();
  const created = await db
    .insert(timeEntries)
    .values({
      startedAt: input.startedAt,
      minutes: Math.max(0, Math.round(input.minutes)),
      source: input.source,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
    })
    .returning();
  return created[0];
}

async function update(id: string, input: Partial<TimeEntryInput>) {
  const patch: Partial<NewTimeEntry> = { updatedAt: nowIso(), syncStatus: 'pending' };
  if (input.startedAt !== undefined) patch.startedAt = input.startedAt;
  if (input.minutes !== undefined) patch.minutes = Math.max(0, Math.round(input.minutes));
  if (input.source !== undefined) patch.source = input.source;

  const updated = await db.update(timeEntries).set(patch).where(eq(timeEntries.id, id)).returning();
  return updated[0];
}

async function remove(id: string) {
  const updated = await db
    .update(timeEntries)
    .set({ deletedAt: nowIso(), updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(timeEntries.id, id))
    .returning();
  return updated[0];
}

async function getBetween(from: string, to: string) {
  return db
    .select()
    .from(timeEntries)
    .where(
      and(
        gte(timeEntries.startedAt, from),
        lt(timeEntries.startedAt, to),
        isNull(timeEntries.deletedAt)
      )
    )
    .orderBy(desc(timeEntries.startedAt));
}

async function getMonth(year: number, month: number) {
  const { from, to } = monthRange(year, month);
  return getBetween(from, to);
}

async function getMonthStats(year: number, month: number): Promise<MonthStats> {
  const rows = await getMonth(year, month);
  const days = new Set(rows.map((row) => dayjs(row.startedAt).format('YYYY-MM-DD')));
  return {
    minutes: rows.reduce((total, row) => total + row.minutes, 0),
    daysOut: days.size,
  };
}

// Entradas desde segunda-feira desta semana.
async function getThisWeek(now = dayjs()) {
  const monday = now.startOf('day').subtract((now.day() + 6) % 7, 'day');
  return getBetween(monday.toISOString(), monday.add(7, 'day').toISOString());
}

export const timeEntriesActions = {
  create,
  update,
  remove,
  getMonth,
  getMonthStats,
  getThisWeek,
};
