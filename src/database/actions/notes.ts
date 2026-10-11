import { normalizeSearch, plainBody } from '@/components/notes/body';
import type { Stage } from '@/constants/stages';
import { and, asc, count, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../db';
import { type NewNote, type Note, notes } from '../schemas/notes';
import { tags } from '../schemas/tags';
import { students } from '../schemas/students';

export type NoteInput = Pick<NewNote, 'title' | 'body' | 'tagId' | 'color' | 'studentId' | 'remoteId'>;

/** Nota da lista, já com o nome da etiqueta. */
export type NoteListItem = Note & { tagName: string | null };

export type NotePage = {
  data: NoteListItem[];
  totalPage: number;
};

export type LinkableStudent = {
  id: string;
  name: string;
  stage: Stage;
};

function nowIso() {
  return new Date().toISOString();
}

function searchTextFor(title: string, body: string) {
  return normalizeSearch(`${title} ${plainBody(body)}`);
}

async function getById(id: string): Promise<Note | null> {
  const note = (await db.select().from(notes).where(eq(notes.id, id)).limit(1))[0];
  return note ?? null;
}

async function createNote(data: NoteInput) {
  const now = nowIso();
  const title = data.title ?? '';
  const body = data.body ?? '';
  const result = await db
    .insert(notes)
    .values({
      title,
      body,
      searchText: searchTextFor(title, body),
      tagId: data.tagId ?? null,
      color: data.color ?? '#E3E7F8',
      studentId: data.studentId ?? null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
      remoteId: data.remoteId ?? null,
    })
    .returning();
  return result[0];
}

async function updateNote(id: string, data: Partial<NoteInput>) {
  let searchText: string | undefined;
  if (data.title !== undefined || data.body !== undefined) {
    const current = await getById(id);
    searchText = searchTextFor(data.title ?? current?.title ?? '', data.body ?? current?.body ?? '');
  }

  const result = await db
    .update(notes)
    .set({ ...data, ...(searchText !== undefined ? { searchText } : {}), updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(notes.id, id))
    .returning();
  return result[0];
}

async function deleteNote(id: string) {
  const result = await db
    .update(notes)
    .set({ deletedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(notes.id, id))
    .returning();
  return result[0];
}

/** Apaga de vez uma nota sem título nem texto, para não ficarem notas vazias na lista. */
async function deleteIfEmpty(id: string) {
  const note = await getById(id);
  if (!note || note.title.trim() !== '' || plainBody(note.body) !== '') return false;
  await db.delete(notes).where(eq(notes.id, id));
  return true;
}

function escapeLike(term: string) {
  return term.replace(/[\\%_]/g, (char) => `\\${char}`);
}

async function getPage(page: number, limit: number, tagId?: string, search?: string): Promise<NotePage> {
  const filters = [isNull(notes.deletedAt)];
  if (tagId) filters.push(eq(notes.tagId, tagId));

  const term = search ? normalizeSearch(search) : '';
  if (term) {
    filters.push(sql`${notes.searchText} LIKE ${`%${escapeLike(term)}%`} ESCAPE '\\'`);
  }

  const where = and(...filters);
  const [{ total }] = await db.select({ total: count() }).from(notes).where(where);
  const rows = await db
    .select({ note: notes, tagName: tags.name })
    .from(notes)
    .leftJoin(tags, eq(notes.tagId, tags.id))
    .where(where)
    .orderBy(desc(notes.updatedAt))
    .limit(limit)
    .offset(page * limit);

  return {
    data: rows.map((row) => ({ ...row.note, tagName: row.tagName })),
    totalPage: Math.ceil((total ?? 0) / limit),
  };
}

async function listByStudent(studentId: string) {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.studentId, studentId), isNull(notes.deletedAt)))
    .orderBy(desc(notes.updatedAt));
}

const linkableColumns = { id: students.id, name: students.displayName, stage: students.stage };

/** Pessoas que se podem ligar a uma nota ou mencionar no texto. */
async function listLinkableStudents(): Promise<LinkableStudent[]> {
  return db
    .select(linkableColumns)
    .from(students)
    .where(isNull(students.deletedAt))
    .orderBy(asc(students.displayName));
}

async function getLinkedStudent(id: string): Promise<LinkableStudent | null> {
  const row = (await db.select(linkableColumns).from(students).where(eq(students.id, id)).limit(1))[0];
  return row ?? null;
}

export const notesActions = {
  getById,
  createNote,
  updateNote,
  deleteNote,
  deleteIfEmpty,
  getPage,
  listByStudent,
  listLinkableStudents,
  getLinkedStudent,
};
