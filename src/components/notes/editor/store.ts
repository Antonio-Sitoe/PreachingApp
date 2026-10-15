import { DEFAULT_NOTE_COLOR } from '@/components/notes/colors';
import { create } from 'zustand';

type EditorValues = {
  id: string;
  tagId: string | null;
  color: string;
  studentId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  isDirty: boolean;
  isSaving: boolean;
};

const initialState = (): EditorValues => ({
  id: '',
  tagId: null,
  color: DEFAULT_NOTE_COLOR,
  studentId: null,
  createdAt: null,
  updatedAt: null,
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
