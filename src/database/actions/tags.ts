import { asc, eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../schemas/notes';
import { TAG_NAME_MAX, type Tag, tags } from '../schemas/tags';

export class TagError extends Error {}

function nowIso() {
  return new Date().toISOString();
}

function cleanName(name: string) {
  const value = name.trim().replace(/\s+/g, ' ');
  if (!value) throw new TagError('Escreve um nome para a etiqueta.');
  if (value.length > TAG_NAME_MAX) throw new TagError(`O nome pode ter até ${TAG_NAME_MAX} letras.`);
  return value;
}

async function ensureUnique(name: string, exceptId?: string) {
  const wanted = name.toLocaleLowerCase('pt');
  const rows = await db.select({ id: tags.id, name: tags.name }).from(tags);
  if (rows.some((row) => row.id !== exceptId && row.name.toLocaleLowerCase('pt') === wanted)) {
    throw new TagError('Já existe uma etiqueta com esse nome.');
  }
}

async function listTags(): Promise<Tag[]> {
  return db.select().from(tags).orderBy(asc(tags.createdAt), asc(tags.name));
}

async function createTag(name: string): Promise<Tag> {
  const value = cleanName(name);
  await ensureUnique(value);
  const now = nowIso();
  const result = await db
    .insert(tags)
    .values({ name: value, createdAt: now, updatedAt: now, syncStatus: 'pending' })
    .returning();
  return result[0];
}

async function renameTag(id: string, name: string): Promise<Tag> {
  const value = cleanName(name);
  await ensureUnique(value, id);
  const result = await db
    .update(tags)
    .set({ name: value, updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(tags.id, id))
    .returning();
  return result[0];
}

async function deleteTag(id: string) {
  db.transaction((tx) => {
    tx.update(notes).set({ tagId: null, syncStatus: 'pending' }).where(eq(notes.tagId, id)).run();
    tx.delete(tags).where(eq(tags.id, id)).run();
  });
}

export const tagsActions = {
  listTags,
  createTag,
  renameTag,
  deleteTag,
};
