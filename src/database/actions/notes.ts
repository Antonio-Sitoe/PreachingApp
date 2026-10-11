import { and, count, desc, eq, inArray, isNull, like, or } from 'drizzle-orm';
import { db } from '../db';
import { type NewNote, type Note, type Tag, noteTags, notes, tags } from '../schemas/notes';

export type NoteWithTags = Note & { tags: string[] };

export type NoteInput = Pick<
  NewNote,
  'title' | 'emoji' | 'colorHex' | 'coverIcon' | 'contentHtml' | 'isArchived' | 'remoteId'
> & { orderIndex?: number };

function nowIso() {
  return new Date().toISOString();
}

function normalizeTagName(name: string) {
  return name.trim().toLowerCase();
}

async function getById(id: string): Promise<NoteWithTags | null> {
  const note = (await db.select().from(notes).where(eq(notes.id, id)).limit(1))[0];
  if (!note) return null;
  return { ...note, tags: await getTagsByNoteId(id) };
}

async function createNote(data: NoteInput) {
  const now = nowIso();
  const result = await db
    .insert(notes)
    .values({
      title: data.title,
      emoji: data.emoji,
      colorHex: data.colorHex,
      coverIcon: data.coverIcon,
      contentHtml: data.contentHtml,
      isArchived: data.isArchived ?? 0,
      orderIndex: data.orderIndex ?? 0,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
      remoteId: data.remoteId ?? null,
    })
    .returning();
  return result[0];
}

async function updateNote(id: string, data: Partial<Omit<NewNote, 'id' | 'createdAt'>>) {
  const result = await db
    .update(notes)
    .set({ ...data, updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(notes.id, id))
    .returning();
  return result[0];
}

async function deleteNote(id: string, soft = true) {
  if (soft) {
    const result = await db
      .update(notes)
      .set({ deletedAt: nowIso(), syncStatus: 'pending' })
      .where(eq(notes.id, id))
      .returning();
    return result[0];
  }

  await db.delete(noteTags).where(eq(noteTags.noteId, id));
  const result = await db.delete(notes).where(eq(notes.id, id)).returning();
  return result[0];
}

async function reorderNotes(order: Array<{ id: string; orderIndex: number }>) {
  const now = nowIso();
  return Promise.all(
    order.map(({ id, orderIndex }) =>
      db
        .update(notes)
        .set({ orderIndex, updatedAt: now, syncStatus: 'pending' })
        .where(eq(notes.id, id))
    )
  );
}

async function createTag(name: string) {
  const result = await db
    .insert(tags)
    .values({ name: normalizeTagName(name), createdAt: nowIso() })
    .returning();
  return result[0];
}

async function getTags() {
  return db.select().from(tags);
}

async function getCountTagsByNoteId(noteId: string) {
  const result = await db.select({ count: count() }).from(noteTags).where(eq(noteTags.noteId, noteId));
  return { count: result[0]?.count ?? 0 };
}

async function getTagsByNoteId(noteId: string): Promise<string[]> {
  const result = await db
    .select({ name: tags.name })
    .from(noteTags)
    .leftJoin(tags, eq(noteTags.tagId, tags.id))
    .where(eq(noteTags.noteId, noteId));

  return result.map((row) => row.name).filter((name): name is string => name !== null);
}

async function findTag(name: string): Promise<Tag | undefined> {
  return (await db.select().from(tags).where(eq(tags.name, normalizeTagName(name))).limit(1))[0];
}

async function addTag(noteId: string, tagName: string) {
  const normalized = normalizeTagName(tagName);
  let tagRow = await findTag(normalized);

  if (!tagRow) {
    const created = await db.insert(tags).values({ name: normalized, createdAt: nowIso() }).returning();
    tagRow = created[0];
  }

  const existing = await db
    .select()
    .from(noteTags)
    .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagRow.id)));

  if (existing.length === 0) {
    await db.insert(noteTags).values({ noteId, tagId: tagRow.id });
  }

  await db
    .update(notes)
    .set({ updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(notes.id, noteId));

  return tagRow;
}

async function removeTag(noteId: string, tagName: string) {
  const tagRow = await findTag(tagName);
  if (!tagRow) return;

  await db.delete(noteTags).where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagRow.id)));
  await db
    .update(notes)
    .set({ updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(notes.id, noteId));
}

async function search(query: string) {
  const term = `%${query.trim()}%`;
  const titleOrBody = or(like(notes.title, term), like(notes.contentHtml, term));
  const baseMatches = await db
    .select()
    .from(notes)
    .where(and(isNull(notes.deletedAt), titleOrBody))
    .orderBy(desc(notes.updatedAt));

  const matchingTags = await db.select().from(tags).where(like(tags.name, term));
  if (matchingTags.length === 0) return baseMatches;

  const joinRows = await db
    .select()
    .from(noteTags)
    .where(
      inArray(
        noteTags.tagId,
        matchingTags.map((tag) => tag.id)
      )
    );

  const merged = new Map(baseMatches.map((note) => [note.id, note]));
  const missingIds = [...new Set(joinRows.map((row) => row.noteId))].filter((id) => !merged.has(id));

  if (missingIds.length > 0) {
    const extras = await db
      .select()
      .from(notes)
      .where(and(isNull(notes.deletedAt), inArray(notes.id, missingIds)));
    for (const note of extras) merged.set(note.id, note);
  }

  return [...merged.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function getAllNotesWithFilters(tagId?: string, searchQuery?: string): Promise<Note[]> {
  const filters = [isNull(notes.deletedAt)];
  const term = searchQuery?.trim();

  if (term) {
    const match = or(like(notes.title, `%${term}%`), like(notes.contentHtml, `%${term}%`));
    if (match) filters.push(match);
  }

  const where = and(...filters);
  if (!where) return [];

  if (tagId?.trim()) {
    const rows = await db
      .select({ note: notes })
      .from(notes)
      .innerJoin(noteTags, eq(notes.id, noteTags.noteId))
      .where(and(eq(noteTags.tagId, tagId.trim()), where))
      .orderBy(desc(notes.updatedAt));
    return rows.map((row) => row.note);
  }

  return db.select().from(notes).where(where).orderBy(desc(notes.updatedAt));
}

export const notesActions = {
  getById,
  createNote,
  updateNote,
  deleteNote,
  reorderNotes,
  createTag,
  getTags,
  getCountTagsByNoteId,
  getTagsByNoteId,
  addTag,
  removeTag,
  search,
  getAllNotesWithFilters,
};
