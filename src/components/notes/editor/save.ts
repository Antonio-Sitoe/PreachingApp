import { useEditorStore } from '@/components/notes/editor/store';
import { showToast } from '@/components/ui/toast';
import { notesActions, type NoteInput } from '@/database/actions';

let timer: ReturnType<typeof setTimeout> | undefined;
let pending: Partial<NoteInput> | null = null;
let inFlight: Promise<void> = Promise.resolve();

function flushNoteSave(): Promise<void> {
  if (timer) clearTimeout(timer);
  timer = undefined;
  const noteId = useEditorStore.getState().id;
  const patch = pending;
  pending = null;
  if (!noteId || !patch) return inFlight;

  useEditorStore.getState().set({ isSaving: true, isDirty: false });
  inFlight = inFlight
    .then(() => notesActions.updateNote(noteId, patch))
    .then(() => {
      if (useEditorStore.getState().id !== noteId) return;
      useEditorStore.getState().set({ isSaving: false });
    })
    .catch(() => {
      if (useEditorStore.getState().id !== noteId) return;
      useEditorStore.getState().set({ isSaving: false });
      showToast({ message: 'Não foi possível guardar a nota.' });
    });
  return inFlight;
}

function saveNote(patch: Partial<NoteInput>) {
  pending = { ...pending, ...patch };
  useEditorStore.getState().set({ isDirty: true });
  if (timer) clearTimeout(timer);
  timer = setTimeout(flushNoteSave, 800);
}

function useSaveNote() {
  return saveNote;
}

export { flushNoteSave, saveNote, useSaveNote };
