import { DEFAULT_NOTE_COLOR } from '@/components/notes/colors';
import type { LinkableStudent } from '@/database/actions';
import type { Note } from '@/database/schemas';
import type { OnChangeStateEvent } from 'react-native-enriched-html';
import { create } from 'zustand';

export type PickerMode = { kind: 'link' };

type EditorValues = {
  id: string;
  title: string;
  body: string;

  // O corpo veio vazio ou no formato antigo: o primeiro HTML do editor só o reescreve, sem gravar.
  awaitingNativeHtml: boolean;
  tagId: string | null;
  color: string;
  studentId: string | null;

  student: LinkableStudent | null;
  createdAt: string | null;
  updatedAt: string | null;
  syncStatus: Note['syncStatus'];
  remoteId: string | null;

  styleState: OnChangeStateEvent | null;

  // Menção a ser escrita depois de um @, com o texto que já foi escrito.
  mention: { query: string } | null;
  isDetailsOpen: boolean;
  isInsertOpen: boolean;

  isTagsOpen: boolean;
  picker: PickerMode | null;
  confirmDelete: boolean;

  isDirty: boolean;
  isSaving: boolean;
};

const initialState = (): EditorValues => ({
  id: '',
  title: '',
  body: '',
  awaitingNativeHtml: false,
  tagId: null,
  color: DEFAULT_NOTE_COLOR,
  studentId: null,
  student: null,
  createdAt: null,
  updatedAt: null,
  syncStatus: 'pending',
  remoteId: null,
  styleState: null,
  mention: null,
  isDetailsOpen: false,
  isInsertOpen: false,
  isTagsOpen: false,
  picker: null,
  confirmDelete: false,
  isDirty: false,
  isSaving: false,
});

type EditorState = EditorValues & {
  set: (values: Partial<EditorValues>) => void;
  resetEditor: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState(),
  set: (values) => set(values),
  resetEditor: () => set(initialState()),
}));
