import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { STAGES, type Stage } from '../../constants/stages';
import { SYNC_STATUSES, users } from './users';

const STAGE_KEYS = Object.keys(STAGES) as [Stage, ...Stage[]];

export const students = sqliteTable('students', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  nameIsProvisional: integer('name_is_provisional', { mode: 'boolean' }).notNull().default(false),
  phone: text('phone'),
  stage: text('stage', { enum: STAGE_KEYS }).notNull().default('contact'),
  status: text('status'),
  rhythmDays: integer('rhythm_days'),
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
