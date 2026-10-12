import { normalizeSearch } from '@/components/notes/body';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import { v4 as uuid } from 'uuid';

// Notas do editor 10tap. Ficam num MMKV próprio, à parte da tabela `notes`, porque o HTML do
// Tiptap não é o mesmo do editor principal.

export type TentapNote = {
  id: string;
  title: string;
  html: string;
  /** Texto sem marcas, para a pesquisa e para a pré-visualização na lista. */
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type TentapNotePatch = Partial<Pick<TentapNote, 'title' | 'html' | 'text'>>;

const NOTE_PREFIX = 'note:';

let storage: MMKV | null = null;

function getStorage(): MMKV {
  storage ??= createMMKV({ id: 'tentap-notes' });
  return storage;
}

function read(key: string): TentapNote | null {
  const raw = getStorage().getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TentapNote;
  } catch {
    return null;
  }
}

function write(note: TentapNote) {
  getStorage().set(NOTE_PREFIX + note.id, JSON.stringify(note));
}

export function listTentapNotes(search?: string): TentapNote[] {
  const term = search ? normalizeSearch(search) : '';
  return getStorage()
    .getAllKeys()
    .filter((key) => key.startsWith(NOTE_PREFIX))
    .map(read)
    .filter((note): note is TentapNote => note !== null)
    .filter((note) => !term || normalizeSearch(`${note.title} ${note.text}`).includes(term))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getTentapNote(id: string) {
  return read(NOTE_PREFIX + id);
}

export function createTentapNote(): TentapNote {
  const now = new Date().toISOString();
  const note: TentapNote = { id: uuid(), title: '', html: '', text: '', createdAt: now, updatedAt: now };
  write(note);
  return note;
}

export function updateTentapNote(id: string, patch: TentapNotePatch) {
  const note = getTentapNote(id);
  if (!note) return null;
  const next: TentapNote = { ...note, ...patch, updatedAt: new Date().toISOString() };
  write(next);
  return next;
}

export function deleteTentapNote(id: string) {
  getStorage().remove(NOTE_PREFIX + id);
}

/** Apaga uma nota sem título nem texto, para não ficarem notas vazias na lista. */
export function deleteTentapNoteIfEmpty(id: string) {
  const note = getTentapNote(id);
  if (!note || note.title.trim() !== '' || note.text.trim() !== '') return false;
  deleteTentapNote(id);
  return true;
}
