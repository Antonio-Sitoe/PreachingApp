import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { SYNC_STATUSES, users } from './users';

export const STUDENT_STAGES = [
  'first_contact',
  'return_visit',
  'study_started',
  'regular_study',
  'unbaptized_publisher',
  'baptized',
] as const;

export const STUDENT_STATUSES = ['active', 'paused', 'closed'] as const;

export const DEFAULT_RHYTHM_DAYS = 7;

export const students = sqliteTable('students', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  note: text('note'),
  phone: text('phone'),
  stage: text('stage', { enum: STUDENT_STAGES }).notNull().default('first_contact'),
  status: text('status', { enum: STUDENT_STATUSES }).notNull().default('active'),
  rhythmDays: integer('rhythm_days').notNull().default(DEFAULT_RHYTHM_DAYS),
  latitude: real('latitude'),
  longitude: real('longitude'),
  address: text('address'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type StudentStage = (typeof STUDENT_STAGES)[number];
export type StudentStatus = (typeof STUDENT_STATUSES)[number];
