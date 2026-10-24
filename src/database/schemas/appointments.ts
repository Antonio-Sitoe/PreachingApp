import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { SYNC_STATUSES } from './users';

export const APPOINTMENT_STATUSES = ['pending', 'done', 'postponed', 'cancelled'] as const;

export const APPOINTMENT_TIMES_OF_DAY = ['any', 'morning', 'afternoon', 'evening'] as const;

export const appointments = sqliteTable(
  'appointments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    // Liga a visits.id. A referência entra quando a tabela visits existir.
    visitId: text('visit_id'),
    scheduledAt: text('scheduled_at').notNull(),
    timeOfDay: text('time_of_day', { enum: APPOINTMENT_TIMES_OF_DAY }).notNull().default('any'),
    status: text('status', { enum: APPOINTMENT_STATUSES }).notNull().default('pending'),
    remindMinutesBefore: integer('remind_minutes_before'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('appointments_status_scheduled_at_idx').on(table.status, table.scheduledAt)]
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type AppointmentTimeOfDay = (typeof APPOINTMENT_TIMES_OF_DAY)[number];
