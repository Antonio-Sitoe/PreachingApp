import { createMMKV, type MMKV } from 'react-native-mmkv';

/**
 * Um só documento de teste, numa instância MMKV própria (separada das notas e do editor v3).
 * Guarda-se o JSON do Cascade tal como vem do nativo.
 */
const DOCUMENT_KEY = 'document';

let storage: MMKV | null = null;

function getStorage(): MMKV {
  storage ??= createMMKV({ id: 'editor-cascade' });
  return storage;
}

export function readDocument(): string {
  return getStorage().getString(DOCUMENT_KEY) ?? '';
}

export function writeDocument(json: string) {
  getStorage().set(DOCUMENT_KEY, json);
}

export function clearDocument() {
  getStorage().remove(DOCUMENT_KEY);
}
