import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { STUDENT_STAGES, students } from './students';
import { SYNC_STATUSES } from './users';

export const stageChanges = sqliteTable(
  'stage_changes',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    // Vazio na primeira etapa, quando o estudante é criado.
    fromStage: text('from_stage', { enum: STUDENT_STAGES }),
    toStage: text('to_stage', { enum: STUDENT_STAGES }).notNull(),
    changedAt: text('changed_at').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('stage_changes_student_id_idx').on(table.studentId, table.changedAt)]
);

export type StageChange = typeof stageChanges.$inferSelect;
export type NewStageChange = typeof stageChanges.$inferInsert;
