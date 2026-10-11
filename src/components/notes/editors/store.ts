import { emptyParagraph, type Block, type InlineStyle } from '@/components/notes/body';
import { DEFAULT_NOTE_COLOR } from '@/components/notes/colors';
import type { LinkableStudent } from '@/database/actions';
import type { Note } from '@/database/schemas';
import { create } from 'zustand';

export type PickerMode =
  | { kind: 'link' }

  | { kind: 'mention'; blockId: string | null; at: number | null };

type EditorValues = {
  id: string;
  title: string;
  body: string;
  blocks: Block[];
  tagId: string | null;
  color: string;
  studentId: string | null;

  student: LinkableStudent | null;
  createdAt: string | null;
  updatedAt: string | null;
  syncStatus: Note['syncStatus'];
  remoteId: string | null;
  focusedId: string | null;

  selection: { start: number; end: number };

  typingStyles: Partial<Record<InlineStyle, boolean>>;

  pendingCursor: { id: string; position: number } | null;
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
  blocks: [emptyParagraph()],
  tagId: null,
  color: DEFAULT_NOTE_COLOR,
  studentId: null,
  student: null,
  createdAt: null,
  updatedAt: null,
  syncStatus: 'pending',
  remoteId: null,
  focusedId: null,
  selection: { start: 0, end: 0 },
  typingStyles: {},
  pendingCursor: null,
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
