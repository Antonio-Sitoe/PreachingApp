import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { SYNC_STATUSES } from './users';

export const TIME_ENTRY_SOURCES = ['timer', 'manual'] as const;

export const timeEntries = sqliteTable(
  'time_entries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    // Início da sessão, ISO. Nas entradas manuais é o dia escolhido.
    startedAt: text('started_at').notNull(),
    minutes: integer('minutes').notNull(),
    source: text('source', { enum: TIME_ENTRY_SOURCES }).notNull().default('manual'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('time_entries_started_at_idx').on(table.startedAt)]
);

export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
export type TimeEntrySource = (typeof TIME_ENTRY_SOURCES)[number];
