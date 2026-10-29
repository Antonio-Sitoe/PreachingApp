import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

export const PAUSE_REASONS = ['travelled', 'asked_to_stop', 'unavailable', 'other'] as const;

export const pauses = sqliteTable(
  'pauses',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    reason: text('reason', { enum: PAUSE_REASONS }).notNull().default('other'),
    note: text('note'),
    pausedAt: text('paused_at').notNull(),
    // Dia para tentar de novo, YYYY-MM-DD.
    retryAt: text('retry_at'),
    // Vazio enquanto a pausa está em curso.
    resumedAt: text('resumed_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('pauses_student_id_idx').on(table.studentId, table.pausedAt)]
);

export type Pause = typeof pauses.$inferSelect;
export type NewPause = typeof pauses.$inferInsert;
export type PauseReason = (typeof PAUSE_REASONS)[number];
