import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

export const BOOK_LESSONS = 60;

export const lessonProgress = sqliteTable(
  'lesson_progress',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    // 1 a 60
    lessonNumber: integer('lesson_number').notNull(),
    startedAt: text('started_at').notNull(),
    completedAt: text('completed_at'),
    // "Tente o seguinte": só o utilizador o marca, nunca é automático.
    goalDone: integer('goal_done', { mode: 'boolean' }).notNull().default(false),
    notes: text('notes'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('lesson_progress_student_id_idx').on(table.studentId, table.lessonNumber)]
);

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type NewLessonProgress = typeof lessonProgress.$inferInsert;
