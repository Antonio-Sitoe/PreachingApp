import { NOTE_COLORS } from '@/components/notes/colors';
import type { CoverIconName } from '@/components/notes/cover-icons';
import type { Note } from '@/database/schemas';
import { create } from 'zustand';

type EditorValues = {
  id: string;
  title: string;
  content: string;
  emoji: string;
  colorHex: string;
  coverIcon: CoverIconName | null;
  contentHtml: string;
  isArchived: number;
  orderIndex: number;
  deletedAt: string | null;
  syncStatus: Note['syncStatus'];
  remoteId: string | null;
  tags: string[];
  isOptionsBottomSheetOpen: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
};

const initialState: EditorValues = {
  id: '',
  title: '',
  content: '',
  emoji: '📝',
  colorHex: NOTE_COLORS[0].color,
  coverIcon: null,
  contentHtml: '',
  isArchived: 0,
  orderIndex: 0,
  deletedAt: null,
  syncStatus: 'pending',
  remoteId: null,
  tags: [],
  isOptionsBottomSheetOpen: false,
  lastSaved: null,
  isSaving: false,
};

type EditorState = EditorValues & {
  set: (values: Partial<EditorValues>) => void;
  resetEditor: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  set: (values) => set(values),
  resetEditor: () => set(initialState),
}));
