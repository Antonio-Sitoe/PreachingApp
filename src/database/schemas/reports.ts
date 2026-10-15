import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { SYNC_STATUSES } from './users';

export const reports = sqliteTable(
  'reports',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    hours: integer('hours').notNull().default(0),
    minutes: integer('minutes').notNull().default(0),
    students: integer('students').notNull().default(0),
    comments: text('comments'),
    date: text('date').notNull(),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    day: integer('day').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('reports_year_month_idx').on(table.year, table.month)]
);

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
