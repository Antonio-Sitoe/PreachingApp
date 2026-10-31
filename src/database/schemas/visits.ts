import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

export const VISIT_OUTCOMES = ['met', 'not_home', 'rescheduled'] as const;

export const visits = sqliteTable(
  'visits',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    visitedAt: text('visited_at').notNull(),
    outcome: text('outcome', { enum: VISIT_OUTCOMES }).notNull().default('met'),
    notes: text('notes'),
    // Lista JSON de textos: ["Salmo 37:29", "Apocalipse 21:4"].
    scriptures: text('scriptures'),
    pendingQuestion: text('pending_question'),
    questionResolvedAt: text('question_resolved_at'),
    promisedToBring: text('promised_to_bring'),
    // 1 a 60, a lição do livro em que ficaram. Vazio quando não estudaram.
    lessonNumber: integer('lesson_number'),
    stoppedAtPoint: text('stopped_at_point'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('visits_student_id_visited_at_idx').on(table.studentId, table.visitedAt)]
);

export type Visit = typeof visits.$inferSelect;
export type NewVisit = typeof visits.$inferInsert;
export type VisitOutcome = (typeof VISIT_OUTCOMES)[number];
