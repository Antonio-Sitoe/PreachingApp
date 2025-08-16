import { and, desc, eq, gte, inArray, lte, or, like } from 'drizzle-orm';
import { db } from '../db';
import {
  notes,
  noteAttachments,
  noteTags,
  tags,
  type NewNote,
  type NewNoteAttachment,
  type Note,
  type Tag,
} from '../schemas/notes';
import { sql } from 'drizzle-orm';

export type NotesSort =
  | {
      field: 'updatedAt' | 'createdAt' | 'orderIndex' | 'title';
      direction?: 'asc' | 'desc';
    }
  | undefined;

export type NotesFilters = {
  studentId?: string;
  tagNames?: string[];
  colorHex?: string;
  aiCategory?: 'progress' | 'doctrinal_doubts' | 'personal_needs' | 'general';
  isArchived?: boolean;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  includeDeleted?: boolean;
};

export type NotesPagination = { limit?: number; offset?: number } | undefined;

export type ListNotesParams = {
  filters?: NotesFilters;
  sort?: NotesSort;
  pagination?: NotesPagination;
};

function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}

function getNowIso(): string {
  return new Date().toISOString();
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

class NotesActions {
  async getById(id: string) {
    const res = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
    return res[0] ?? null;
  }
  async createNote(
    data: Omit<
      NewNote,
      'id' | 'createdAt' | 'updatedAt' | 'syncStatus' | 'orderIndex'
    > & { orderIndex?: number }
  ) {
    const now = getNowIso();
    const result = await db
      .insert(notes)
      .values({
        title: data.title,
        emoji: data.emoji,
        colorHex: data.colorHex,
        coverUri: data.coverUri,
        studentId: data.studentId,
        contentJson: data.contentJson,
        contentHtml: data.contentHtml,
        audioUri: data.audioUri,
        audioTranscript: data.audioTranscript,
        aiCategory: data.aiCategory,
        aiSummary: data.aiSummary,
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

  async updateNote(
    id: string,
    data: Partial<Omit<NewNote, 'id' | 'createdAt'>>
  ) {
    const now = getNowIso();
    const result = await db
      .update(notes)
      .set({
        ...data,
        updatedAt: now,
        syncStatus: 'pending',
      })
      .where(eq(notes.id, id))
      .returning();
    return result[0];
  }

  async deleteNote(id: string, soft: boolean = true) {
    if (soft) {
      const result = await db
        .update(notes)
        .set({ deletedAt: getNowIso(), syncStatus: 'pending' })
        .where(eq(notes.id, id))
        .returning();
      return result[0];
    }

    // Hard delete: remove relations first
    await db.delete(noteTags).where(eq(noteTags.noteId, id));
    await db.delete(noteAttachments).where(eq(noteAttachments.noteId, id));

    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result[0];
  }

  async listNotes({ filters, sort, pagination }: ListNotesParams = {}) {
    const whereClauses = [] as unknown[];

    if (filters?.studentId)
      whereClauses.push(eq(notes.studentId, filters.studentId));
    if (filters?.colorHex)
      whereClauses.push(eq(notes.colorHex, filters.colorHex));
    if (filters?.aiCategory)
      whereClauses.push(eq(notes.aiCategory, filters.aiCategory));
    if (filters?.isArchived !== undefined)
      whereClauses.push(eq(notes.isArchived, filters.isArchived ? 1 : 0));
    if (!filters?.includeDeleted)
      whereClauses.push(eq(notes.deletedAt, sql`NULL`));
    if (filters?.dateFrom)
      whereClauses.push(gte(notes.createdAt, String(filters.dateFrom)));
    if (filters?.dateTo)
      whereClauses.push(lte(notes.createdAt, String(filters.dateTo)));

    // Base query
    let query = db.select().from(notes);

    if (whereClauses.length > 0) {
      query = query.where(and(...whereClauses));
    }

    // Sorting
    const direction = sort?.direction ?? 'desc';
    if (sort?.field === 'title') {
      query = query.orderBy(
        direction === 'asc' ? notes.title : desc(notes.title)
      );
    } else if (sort?.field === 'orderIndex') {
      query = query.orderBy(
        direction === 'asc' ? notes.orderIndex : desc(notes.orderIndex)
      );
    } else if (sort?.field === 'createdAt') {
      query = query.orderBy(
        direction === 'asc' ? notes.createdAt : desc(notes.createdAt)
      );
    } else {
      // default updatedAt desc
      query = query.orderBy(
        direction === 'asc' ? notes.updatedAt : desc(notes.updatedAt)
      );
    }

    if (pagination?.limit !== undefined) {
      query = query.limit(pagination.limit);
    }
    if (pagination?.offset !== undefined) {
      query = query.offset(pagination.offset);
    }

    const result = await query;

    // If filtering by tag names, do it separately to keep query simple in SQLite
    if (filters?.tagNames && filters.tagNames.length > 0) {
      const normalized = filters.tagNames.map(normalizeTagName);
      const tagRows = await db
        .select()
        .from(tags)
        .where(inArray(tags.name, normalized));
      if (tagRows.length === 0) return [];
      const tagIds = tagRows.map((t) => t.id);
      const noteTagRows = await db
        .select()
        .from(noteTags)
        .where(inArray(noteTags.tagId, tagIds));
      const allowedNoteIds = new Set(noteTagRows.map((r) => r.noteId));
      return result.filter((n) => allowedNoteIds.has(n.id));
    }

    return result;
  }

  async reorderNotes(order: Array<{ id: string; orderIndex: number }>) {
    const updates = await Promise.all(
      order.map(({ id, orderIndex }) =>
        db
          .update(notes)
          .set({ orderIndex, updatedAt: getNowIso(), syncStatus: 'pending' })
          .where(eq(notes.id, id))
      )
    );
    return updates.flat();
  }

  async attachStudent(noteId: string, studentId: string | null) {
    const result = await db
      .update(notes)
      .set({ studentId, updatedAt: getNowIso(), syncStatus: 'pending' })
      .where(eq(notes.id, noteId))
      .returning();
    return result[0];
  }

  async addTag(noteId: string, tagName: string) {
    const normalized = normalizeTagName(tagName);
    const now = getNowIso();

    // Upsert tag by name
    let tagRow = (
      await db.select().from(tags).where(eq(tags.name, normalized)).limit(1)
    )[0] as Tag | undefined;

    if (!tagRow) {
      const created = await db
        .insert(tags)
        .values({ name: normalized, colorHex: null, createdAt: now })
        .returning();
      tagRow = created[0];
    }

    // Link note <-> tag (idempotent-ish: rely on schema uniqueness if added later)
    const existing = await db
      .select()
      .from(noteTags)
      .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagRow.id)));
    if (existing.length === 0) {
      await db.insert(noteTags).values({ noteId, tagId: tagRow.id });
    }

    // Touch note
    await db
      .update(notes)
      .set({ updatedAt: now, syncStatus: 'pending' })
      .where(eq(notes.id, noteId));

    return tagRow;
  }

  async removeTag(noteId: string, tagName: string) {
    const normalized = normalizeTagName(tagName);
    const tagRow = (
      await db.select().from(tags).where(eq(tags.name, normalized)).limit(1)
    )[0] as Tag | undefined;
    if (!tagRow) return;

    await db
      .delete(noteTags)
      .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagRow.id)));

    await db
      .update(notes)
      .set({ updatedAt: getNowIso(), syncStatus: 'pending' })
      .where(eq(notes.id, noteId));
  }

  async addAttachment(
    noteId: string,
    attachment: Omit<NewNoteAttachment, 'id' | 'noteId' | 'createdAt'>
  ) {
    const now = getNowIso();
    const result = await db
      .insert(noteAttachments)
      .values({
        noteId,
        type: attachment.type,
        uri: attachment.uri,
        createdAt: now,
      })
      .returning();

    await db
      .update(notes)
      .set({ updatedAt: now, syncStatus: 'pending' })
      .where(eq(notes.id, noteId));

    return result[0];
  }

  async removeAttachment(attachmentId: string) {
    // Fetch attachment to get noteId to touch parent
    const existing = await db
      .select()
      .from(noteAttachments)
      .where(eq(noteAttachments.id, attachmentId))
      .limit(1);
    const row = existing[0];
    if (!row) return;

    await db
      .delete(noteAttachments)
      .where(eq(noteAttachments.id, attachmentId));
    await db
      .update(notes)
      .set({ updatedAt: getNowIso(), syncStatus: 'pending' })
      .where(eq(notes.id, row.noteId));
  }

  async search(query: string) {
    const q = `%${query.trim()}%`;
    // Basic LIKE search on title, contentHtml, audioTranscript
    const baseMatches = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.deletedAt, sql`NULL`),
          or(
            like(notes.title, q),
            like(notes.contentHtml, q),
            like(notes.audioTranscript, q)
          )
        )
      )
      .orderBy(desc(notes.updatedAt));

    // Tag matches
    const matchingTags = await db.select().from(tags).where(like(tags.name, q));
    if (matchingTags.length === 0) return baseMatches;
    const tagIds = matchingTags.map((t) => t.id);
    const joinRows = await db
      .select()
      .from(noteTags)
      .where(inArray(noteTags.tagId, tagIds));
    const noteIdsFromTags = new Set(joinRows.map((r) => r.noteId));
    const merged = new Map<string, Note>();
    for (const n of baseMatches) merged.set(n.id, n);
    for (const id of noteIdsFromTags) {
      const hit = baseMatches.find((n) => n.id === id);
      if (!hit) {
        const extra = await db.select().from(notes).where(eq(notes.id, id));
        if (extra[0]) merged.set(extra[0].id, extra[0]);
      }
    }
    return Array.from(merged.values()).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }

  async wordCount(noteId: string) {
    const row = (
      await db
        .select({ contentHtml: notes.contentHtml })
        .from(notes)
        .where(eq(notes.id, noteId))
        .limit(1)
    )[0];
    if (!row) return 0;
    const text = htmlToPlainText(row.contentHtml);
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }

  // Minimal seed helper (non-invasive). Creates one example note if there are none.
  async seedMinimum() {
    const countRows = await db.select({ id: notes.id }).from(notes).limit(1);
    if (countRows.length > 0) return null;
    const example = await this.createNote({
      title: 'Minha primeira anotação',
      emoji: '📝',
      colorHex: '#FEE2E2',
      coverUri: null,
      studentId: null,
      contentJson: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Olá, mundo!' }],
          },
        ],
      }),
      contentHtml: '<p>Olá, mundo!</p>',
      audioUri: null,
      audioTranscript: null,
      aiCategory: 'general',
      aiSummary: null,
      isArchived: 0,
      orderIndex: 0,
      remoteId: null,
    });
    await this.addTag(example.id, 'geral');
    return example;
  }
}

export const notesActions = new NotesActions();
