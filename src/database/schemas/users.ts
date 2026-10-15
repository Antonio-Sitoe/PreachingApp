import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const PUBLISHER_TYPES = [
  'publisher',
  'bethelite',
  'auxiliary_pioneer',
  'circuit_overseer',
  'regular_pioneer',
  'special_pioneer',
  'missionary',
] as const;

export const LANGUAGES = ['pt', 'en'] as const;

export const SYNC_STATUSES = ['pending', 'synced'] as const;

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text('name').notNull().default(''),
  publisherType: text('publisher_type', { enum: PUBLISHER_TYPES }).notNull().default('publisher'),
  language: text('language', { enum: LANGUAGES }).notNull().default('pt'),
  monthlyHourGoal: integer('monthly_hour_goal'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PublisherType = (typeof PUBLISHER_TYPES)[number];
export type Language = (typeof LANGUAGES)[number];
