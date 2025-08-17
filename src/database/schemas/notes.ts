import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const notes = sqliteTable('notes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  title: text('title').notNull(),
  emoji: text('emoji'),
  colorHex: text('color_hex').notNull().default('#A1CEDC'),
  coverIcon: text('cover_icon'),

  contentHtml: text('content_html').notNull(),

  isArchived: integer('is_archived').notNull().default(0),
  orderIndex: integer('order_index').notNull().default(0),

  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  syncStatus: text('sync_status').notNull().default('pending'),
  remoteId: text('remote_id'),
});

export const tags = sqliteTable('tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text('name').unique().notNull(),
  createdAt: text('created_at').notNull(),
});

export const noteTags = sqliteTable('note_tags', {
  noteId: text('note_id').notNull(),
  tagId: text('tag_id').notNull(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type NoteTag = typeof noteTags.$inferSelect;
