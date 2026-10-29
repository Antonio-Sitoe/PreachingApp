import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

// `custom`: texto livre escrito pelo utilizador. `part_review`: revisão de parte do livro (EST-05).
export const MILESTONE_TYPES = ['custom', 'part_review'] as const;

export const milestones = sqliteTable(
  'milestones',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    type: text('type', { enum: MILESTONE_TYPES }).notNull().default('custom'),
    label: text('label').notNull(),
    // Dia do marco, YYYY-MM-DD.
    occurredAt: text('occurred_at').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('milestones_student_id_idx').on(table.studentId, table.occurredAt)]
);

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];
