import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const students = sqliteTable('students', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text('name').notNull(),
  age: text('age').notNull(),
  about: text('about'),
  telephone: text('telephone'),
  email: text('email'),
  gender: text('gender').notNull(),
  address: text('address'),
  createdAt: text('created_at').notNull(),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
