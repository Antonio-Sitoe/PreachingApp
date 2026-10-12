import { documentTitle } from '@/components/editor-v3/markdown';
import type { EditorV3Content, EditorV3Document } from '@/components/editor-v3/types';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import { v4 as uuid } from 'uuid';

/**
 * Os documentos do editor v3 vivem numa instância MMKV própria, separada das notas (SQLite)
 * e do storage da app ('preaching-assistant'). É só para experimentar o editor.
 */
const INDEX_KEY = 'documents.index';
const documentKey = (id: string) => `documents.${id}`;

let storage: MMKV | null = null;

function getStorage(): MMKV {
  storage ??= createMMKV({ id: 'editor-v3' });
  return storage;
}

function readIndex(): string[] {
  try {
    const parsed: unknown = JSON.parse(getStorage().getString(INDEX_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]) {
  getStorage().set(INDEX_KEY, JSON.stringify(ids));
}

export function getDocument(id: string): EditorV3Document | null {
  const raw = getStorage().getString(documentKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EditorV3Document;
  } catch {
    return null;
  }
}

/** Mais recentes primeiro. */
export function listDocuments(): EditorV3Document[] {
  return readIndex()
    .map(getDocument)
    .filter((doc): doc is EditorV3Document => doc !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createDocument(): EditorV3Document {
  const now = new Date().toISOString();
  const doc: EditorV3Document = {
    id: uuid(),
    title: '',
    version: 1,
    blocks: [],
    createdAt: now,
    updatedAt: now,
  };
  getStorage().set(documentKey(doc.id), JSON.stringify(doc));
  writeIndex([doc.id, ...readIndex()]);
  return doc;
}

export function saveDocumentContent(id: string, content: EditorV3Content): EditorV3Document | null {
  const current = getDocument(id);
  if (!current) return null;
  const next: EditorV3Document = {
    ...current,
    version: 1,
    blocks: content.blocks,
    title: documentTitle(content),
    updatedAt: new Date().toISOString(),
  };
  getStorage().set(documentKey(id), JSON.stringify(next));
  return next;
}

export function deleteDocument(id: string) {
  getStorage().remove(documentKey(id));
  writeIndex(readIndex().filter((item) => item !== id));
}

/** Um documento sem texto nenhum não vale a pena guardar (igual às notas vazias). */
export function deleteIfEmpty(id: string) {
  const doc = getDocument(id);
  if (doc && doc.blocks.every((block) => block.markdown.trim() === '')) deleteDocument(id);
}
