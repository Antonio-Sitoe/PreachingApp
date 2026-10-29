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

export const STUDENT_AGE_RANGES = ['5_15', '16_30', '31_45', 'over_45'] as const;

export const STUDENT_GENDERS = ['male', 'female'] as const;

export const DEFAULT_RHYTHM_DAYS = 7;

export const students = sqliteTable('students', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  // Captura no terreno: "Senhora da loja azul" até se saber o nome.
  nameIsProvisional: integer('name_is_provisional', { mode: 'boolean' }).notNull().default(false),
  note: text('note'),
  phone: text('phone'),
  ageRange: text('age_range', { enum: STUDENT_AGE_RANGES }),
  gender: text('gender', { enum: STUDENT_GENDERS }),
  stage: text('stage', { enum: STUDENT_STAGES }).notNull().default('first_contact'),
  status: text('status', { enum: STUDENT_STATUSES }).notNull().default('active'),
  rhythmDays: integer('rhythm_days').notNull().default(DEFAULT_RHYTHM_DAYS),
  latitude: real('latitude'),
  longitude: real('longitude'),
  address: text('address'),
  // "Como chegar": indicações livres para encontrar a casa.
  directions: text('directions'),
  // Quando o ponto (latitude, longitude) foi captado.
  locatedAt: text('located_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type StudentStage = (typeof STUDENT_STAGES)[number];
export type StudentStatus = (typeof STUDENT_STATUSES)[number];
export type StudentAgeRange = (typeof STUDENT_AGE_RANGES)[number];
export type StudentGender = (typeof STUDENT_GENDERS)[number];
