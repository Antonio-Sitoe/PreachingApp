import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { sql } from 'drizzle-orm';
import type { WeekDayEnum } from '@/@types/enums';

export const studentAvailabilities = sqliteTable('student_availabilities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  studentId: text()
    .notNull()
    .references(() => students.id),
  weekday: integer().notNull(),
  hour: integer().notNull(),
  minute: integer().notNull(),
  title: text().notNull(),
  body: text().notNull(),
  isActive: integer({ mode: 'boolean' }).notNull().default(true),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type StudentAvailability = typeof studentAvailabilities.$inferSelect;

export type NewStudentAvailability = Omit<
  typeof studentAvailabilities.$inferInsert,
  'weekday' | 'createdAt' | 'updatedAt'
> & {
  weekday: WeekDayEnum;
};
