import { plainBody, STUDENT_ID_ATTRIBUTE } from '@/components/notes/body';
import { saveNote } from '@/components/notes/editors/save';
import { useEditorStore } from '@/components/notes/editors/store';
import type { LinkableStudent } from '@/database/actions';
import { createRef } from 'react';
import type { EnrichedTextInputInstance } from 'react-native-enriched-html';

const state = () => useEditorStore.getState();

export const editorRef = createRef<EnrichedTextInputInstance>();

// Comprimento do texto, para pôr o cursor no fim quando se toca abaixo do texto.
let textLength: number | null = null;

export type FormatStyle = 'bold' | 'italic' | 'heading' | 'bullet' | 'ordered' | 'task' | 'quote' | 'code';

export function changeBody(html: string) {
  const { body, awaitingNativeHtml } = state();
  if (html === body) return;

  if (awaitingNativeHtml) {
    state().set({ awaitingNativeHtml: false });
    // O editor só reescreveu o conteúdo carregado; não é uma alteração da pessoa.
    if (plainBody(html) === plainBody(body)) {
      state().set({ body: html });
      return;
    }
  }

  state().set({ body: html });
  saveNote({ body: html });
}

export function changeTextLength(value: string) {
  textLength = value.length;
}

export function resetTextLength() {
  textLength = null;
}

export function format(style: FormatStyle) {
  const editor = editorRef.current;
  if (!editor) return;
  editor.focus();
  switch (style) {
    case 'bold':
      editor.toggleBold();
      break;
    case 'italic':
      editor.toggleItalic();
      break;
    case 'heading':
      editor.toggleH2();
      break;
    case 'bullet':
      editor.toggleUnorderedList();
      break;
    case 'ordered':
      editor.toggleOrderedList();
      break;
    case 'task':
      editor.toggleCheckboxList(false);
      break;
    case 'quote':
      editor.toggleBlockQuote();
      break;
    case 'code':
      editor.toggleCodeBlock();
      break;
  }
}

export function focusEnd() {
  const editor = editorRef.current;
  if (!editor) return;
  editor.focus();
  if (textLength !== null) editor.setSelection(textLength, textLength);
}

export function focusStart() {
  const editor = editorRef.current;
  if (!editor) return;
  editor.focus();
  editor.setSelection(0, 0);
}

export function startMention() {
  const editor = editorRef.current;
  if (!editor) return;
  editor.focus();
  editor.startMention('@');
}

export function linkStudent(student: LinkableStudent | null) {
  state().set({ studentId: student?.id ?? null, student });
  saveNote({ studentId: student?.id ?? null });
}

export function insertMention(student: LinkableStudent) {
  editorRef.current?.setMention('@', `@${student.name}`, { [STUDENT_ID_ATTRIBUTE]: student.id });
  state().set({ mention: null });
  if (!state().studentId) linkStudent(student);
}
