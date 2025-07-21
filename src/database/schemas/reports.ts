import { v4 as uuid } from 'uuid';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const reports = sqliteTable('reports', {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  hours: integer().notNull(),
  minutes: integer().notNull(),
  students: integer().notNull(),
  comments: text(),
  date: text().notNull(), //DD-MM-YYYY
  year: text().notNull(),
  month: text().notNull(),
  day: text().notNull(),
  createdAt: text().notNull(),
  updatedAt: text().notNull(),
});

export type IReport = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
