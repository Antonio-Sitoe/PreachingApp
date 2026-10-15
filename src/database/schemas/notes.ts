import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { students } from './students';
import { tags } from './tags';
import { SYNC_STATUSES } from './users';

export const notes = sqliteTable('notes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  title: text('title').notNull().default(''),
  body: text('body').notNull().default(''),
  searchText: text('search_text').notNull().default(''),
  tagId: text('tag_id').references(() => tags.id, { onDelete: 'set null' }),
  color: text('color').notNull().default('#E3E7F8'),
  studentId: text('student_id').references(() => students.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  remoteId: text('remote_id'),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
