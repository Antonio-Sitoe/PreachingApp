import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';

export const studentAvailabilities = sqliteTable('student_availabilities', {
  id: text('id').primaryKey().$defaultFn(() => uuid()),
  studentId: text('student_id').notNull().references(() => students.id),
  weekDay: text('week_day').notNull(), // Ex: 'Segunda-feira'
  startTime: text('start_time'),       // Ex: '08:00' (24h)
  endTime: text('end_time'),           // Ex: '12:00' (24h)
  notificationEnabled: integer('notification_enabled').notNull().default(1), // 1 = true, 0 = false
});

export type StudentAvailability = typeof studentAvailabilities.$inferSelect;
export type NewStudentAvailability = typeof studentAvailabilities.$inferInsert;
