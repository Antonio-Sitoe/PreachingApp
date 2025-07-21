import { v4 as uuid } from 'uuid';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { students } from './students';

export const visits = sqliteTable('visits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  studentsId: text('students_id')
    .notNull()
    .references(() => students.id),
  notes: text('notes'),
  publications: text('publications'),
  biblicalTexts: text('biblical_texts'),
  nextTime: text('next_time'),
  videos: text('videos'),
  result: text('result'),
  dateAndHours: text('date_and_hours').notNull(),
  createdAt: text('created_at').notNull(),
});

export type IVisit = typeof visits.$inferSelect;
export type INewVisit = typeof visits.$inferInsert;
