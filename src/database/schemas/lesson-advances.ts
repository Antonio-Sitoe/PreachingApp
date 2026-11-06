import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';
import { visits } from './visits';

export const lessonAdvances = sqliteTable(
  'lesson_advances',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    visitId: text('visit_id')
      .notNull()
      .references(() => visits.id, { onDelete: 'cascade' }),
    lesson: integer('lesson').notNull(),
    previousVisitLesson: integer('previous_visit_lesson'),
    // JSON no formato de AdvanceUndoData.
    undoData: text('undo_data').notNull(),
    undoneAt: text('undone_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [
    index('lesson_advances_student_id_idx').on(table.studentId, table.createdAt),
    index('lesson_advances_visit_id_idx').on(table.visitId),
  ]
);

export type LessonAdvance = typeof lessonAdvances.$inferSelect;
export type NewLessonAdvance = typeof lessonAdvances.$inferInsert;
