import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { SYNC_STATUSES } from './users';

/** Etiquetas das notas. Pregação, Reflexão e Devocional vêm de origem (migração 0002). */
export const tags = sqliteTable('tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text('name').notNull().unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

/** O tamanho máximo do nome, para caber num chip. */
export const TAG_NAME_MAX = 24;
