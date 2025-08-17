import { and, desc, eq, inArray, or, like, count } from 'drizzle-orm';
import { db } from '../db';
import {
  notes,
  noteTags,
  tags,
  type NewNote,
  type Note,
  type Tag,
} from '../schemas/notes';
import { sql } from 'drizzle-orm';

function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}

function getNowIso(): string {
  return new Date().toISOString();
}

class NotesActions {
  async getById(id: string) {
    const res = await db
      .select({
        notes: notes,
        tags: sql<string>`
        COALESCE(
          json_group_array(
            CASE 
              WHEN ${tags.name} IS NOT NULL 
              THEN ${tags.name} 
              ELSE NULL 
            END
          ),
          json_array()
        )
      `.as('tags'),
      })
      .from(notes)
      .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
      .leftJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(notes.id, id))
      .groupBy(notes.id)
      .limit(1);

    const result = res[0];
    if (!result) return null;

    console.log('result', result.tags);

    return {
      ...result.notes,
      tags: result.tags ? JSON.parse(result.tags)?.filter(Boolean) : [],
    };
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

    await db.delete(noteTags).where(eq(noteTags.noteId, id));

    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result[0];
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

  async createTag(name: string) {
    const now = getNowIso();
    const normalized = normalizeTagName(name);
    const result = await db
      .insert(tags)
      .values({ name: normalized, createdAt: now })
      .returning();
    return result[0];
  }

  async getTags() {
    const result = await db.select().from(tags);
    return result;
  }

  async getCountTagsByNoteId(noteId: string) {
    const result = await db
      .select({ count: count() })
      .from(noteTags)
      .where(eq(noteTags.noteId, noteId));
    return { count: result[0].count };
  }

  async addTag(noteId: string, tagName: string) {
    const normalized = normalizeTagName(tagName);
    const now = getNowIso();

    let tagRow = (
      await db.select().from(tags).where(eq(tags.name, normalized)).limit(1)
    )[0] as Tag | undefined;

    if (!tagRow) {
      const created = await db
        .insert(tags)
        .values({ name: normalized, createdAt: now })
        .returning();
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

  async search(query: string) {
    const q = `%${query.trim()}%`;
    const baseMatches = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.deletedAt, sql`NULL`),
          or(like(notes.title, q), like(notes.contentHtml, q))
        )
      )
      .orderBy(desc(notes.updatedAt));

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

  async getAllNotesWithFilters(tagId?: string, searchQuery?: string) {
    const whereClauses: any[] = [];

    whereClauses.push(sql`${notes.deletedAt} IS NULL`);

    if (searchQuery && searchQuery.trim()) {
      const searchTerm = `%${searchQuery.trim()}%`;
      whereClauses.push(
        or(like(notes.title, searchTerm), like(notes.contentHtml, searchTerm))
      );
    }

    let query = db.select().from(notes);

    if (tagId && tagId.trim()) {
      // @ts-expect-error
      query = query
        .innerJoin(noteTags, eq(notes.id, noteTags.noteId))
        .where(and(eq(noteTags.tagId, tagId.trim()), ...whereClauses));
    } else {
      if (whereClauses.length > 0) {
        // @ts-expect-error
        query = query.where(and(...whereClauses));
      }
    }

    // @ts-expect-error
    query = query.orderBy(desc(notes.updatedAt));

    try {
      const result = await query;

      if (tagId && tagId.trim()) {
        return result.map((row: any) => row.notes || row);
      }

      return result;
    } catch (error) {
      console.error('Erro ao buscar anotações:', error);
      return [];
    }
  }
}

export const notesActions = new NotesActions();
