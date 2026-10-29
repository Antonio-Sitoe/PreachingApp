import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

/** Uma linha por dia da semana em que o estudante costuma estar. */
export const studentAvailabilities = sqliteTable(
  'student_availabilities',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    // 1 (segunda) a 7 (domingo), como em month_plans.weekdays.
    weekday: integer('weekday').notNull(),
    // "Melhor hora", HH:mm: a mesma em todos os dias escolhidos. Vazio quando só se sabe o dia.
    time: text('time'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('student_availabilities_student_id_idx').on(table.studentId, table.weekday)]
);

export type StudentAvailability = typeof studentAvailabilities.$inferSelect;
export type NewStudentAvailability = typeof studentAvailabilities.$inferInsert;
