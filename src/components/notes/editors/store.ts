import { create } from 'zustand';
import type { Note } from '@/database/schemas';
import type { IconName as RegistryIconName } from '@/lib/icons/icon-registry';
import { VARIANT_COLORS } from '@/constants/variant-colors';

type INote = Omit<Note, 'createdAt' | 'updatedAt'>;
interface EditorValues extends INote {
  content: string;
  emoji: string;
  coverIcon: IconName | null;
  tags: string[];
  isOptionsBottomSheetOpen: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
}

interface EditorState extends EditorValues {
  set(values: Partial<EditorValues>): void;
  resetEditor: () => void;
}

export type IconName = RegistryIconName;

const initialState: EditorValues = {
  id: '',
  title: '',
  content: '',
  emoji: '📝',
  colorHex: VARIANT_COLORS[0].color,
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

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  set: (values) => set((state) => ({ ...state, ...values })),
  resetEditor: () => set(initialState),
}));
