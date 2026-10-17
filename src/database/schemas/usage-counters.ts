import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const USAGE_EVENTS = [
  'app_open',
  'visit_logged',
  'student_created',
  'lesson_completed',
] as const;

export const usageCounters = sqliteTable(
  'usage_counters',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    day: text('day').notNull(),
    event: text('event', { enum: USAGE_EVENTS }).notNull(),
    count: integer('count').notNull().default(0),
    sentAt: text('sent_at'),
  },
  (table) => [uniqueIndex('usage_counters_day_event_idx').on(table.day, table.event)]
);

export type UsageCounter = typeof usageCounters.$inferSelect;
export type UsageEvent = (typeof USAGE_EVENTS)[number];
