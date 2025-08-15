import { create } from 'zustand';

interface EditorState {
  // Note properties
  noteId: string | null;
  title: string;
  content: string;
  emoji: string;
  backgroundColor: string;

  // UI state
  isOptionsBottomSheetOpen: boolean;
  lastSaved: Date | null;

  // Actions
  setNoteId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setEmoji: (emoji: string) => void;
  setBackgroundColor: (color: string) => void;
  setOptionsBottomSheetOpen: (open: boolean) => void;
  setLastSaved: (date: Date) => void;
  resetEditor: () => void;
}

// Available colors for notes
export const NOTE_COLORS = [
  { name: 'Default', color: '#A1CEDC', darkColor: '#1D3D47' },
  { name: 'Coral', color: '#FF6B6B', darkColor: '#CC4040' },
  { name: 'Turquoise', color: '#4ECDC4', darkColor: '#3BA39B' },
  { name: 'Blue', color: '#45B7D1', darkColor: '#3692A8' },
  { name: 'Mint', color: '#96CEB4', darkColor: '#77A591' },
  { name: 'Yellow', color: '#FFEAA7', darkColor: '#CCB885' },
  { name: 'Purple', color: '#DDA0DD', darkColor: '#B080B0' },
  { name: 'Teal', color: '#98D8C8', darkColor: '#79ADA0' },
  { name: 'Peach', color: '#F7DC6F', darkColor: '#C4B059' },
  { name: 'Lavender', color: '#BB8FCE', darkColor: '#9570A5' },
  { name: 'Sky', color: '#85C1E9', darkColor: '#6A9ABA' },
];

const initialState = {
  noteId: null,
  title: '📝 Editors',
  content: '',
  emoji: '📝',
  backgroundColor: NOTE_COLORS[0].color,
  isOptionsBottomSheetOpen: false,
  lastSaved: null,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setNoteId: (id) => set({ noteId: id }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setEmoji: (emoji) => set({ emoji }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setOptionsBottomSheetOpen: (open) => set({ isOptionsBottomSheetOpen: open }),
  setLastSaved: (date) => set({ lastSaved: date }),

  resetEditor: () => set(initialState),
}));
