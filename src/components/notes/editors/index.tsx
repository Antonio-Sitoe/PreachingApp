import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { parseBody } from '@/components/notes/body';
import { DetailsSheet } from '@/components/notes/editors/details-sheet';
import { EditorDocument } from '@/components/notes/editors/editor-document';
import { EditorHeader, EditorTopBar } from '@/components/notes/editors/editor-header';
import { InsertSheet } from '@/components/notes/editors/insert-sheet';
import { TagsSheet } from '@/components/notes/editors/tags-sheet';
import { flushNoteSave } from '@/components/notes/editors/save';
import { useEditorStore } from '@/components/notes/editors/store';
import { StudentPickerSheet } from '@/components/notes/editors/student-picker-sheet';
import { notesActions } from '@/database/actions';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function NotesEditor() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const set = useEditorStore((state) => state.set);
  const resetEditor = useEditorStore((state) => state.resetEditor);
  const confirmDelete = useEditorStore((state) => state.confirmDelete);
  const title = useEditorStore((state) => state.title);
  const [loaded, setLoaded] = useState<{ isNew: boolean } | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function load(noteId: string) {
      const note = await notesActions.getById(noteId);
      if (!active) return;
      if (!note || note.deletedAt) {
        showToast({ message: 'Esta nota já não existe.' });
        router.back();
        return;
      }
      const student = note.studentId ? await notesActions.getLinkedStudent(note.studentId) : null;
      if (!active) return;
      useEditorStore.getState().set({
        id: note.id,
        title: note.title,
        body: note.body,
        blocks: parseBody(note.body),
        tagId: note.tagId,
        color: note.color,
        studentId: note.studentId,
        student,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        syncStatus: note.syncStatus,
        remoteId: note.remoteId,
      });
      setLoaded({ isNew: note.title === '' && note.body === '' });
    }

    load(id).catch(() => {
      if (!active) return;
      showToast({ message: 'Não foi possível abrir a nota.' });
      router.back();
    });

    return () => {
      active = false;
      const noteId = useEditorStore.getState().id;

      const saved = flushNoteSave();
      resetEditor();
      if (!noteId) return;
      void saved
        .then(() => notesActions.deleteIfEmpty(noteId))
        .catch(() => undefined)
        .then(() => queryClient.invalidateQueries({ queryKey: ['notes'] }));
    };

  }, [id]);

  async function deleteNote() {
    const noteId = useEditorStore.getState().id;
    if (!noteId) return;
    set({ confirmDelete: false });
    try {
      await flushNoteSave();
      await notesActions.deleteNote(noteId);
      router.back();
    } catch {
      showToast({ message: 'Não foi possível apagar a nota.' });
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-card">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <EditorTopBar />
        {loaded ? <EditorDocument header={<EditorHeader autoFocusTitle={loaded.isNew} />} /> : null}
      </KeyboardAvoidingView>
      <InsertSheet />
      <DetailsSheet />
      <TagsSheet />
      <StudentPickerSheet />
      <AlertDialog
        open={confirmDelete}
        onClose={() => set({ confirmDelete: false })}
        icon="trash"
        tone="destructive"
        title="Apagar esta nota?"
        description={`"${title.trim() || 'Sem título'}" é apagada deste telemóvel. Não dá para desfazer.`}>
        <Button variant="destructive" onPress={deleteNote}>
          <Text>Apagar nota</Text>
        </Button>
        <Button variant="ghost" onPress={() => set({ confirmDelete: false })}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </SafeAreaView>
  );
}

export { NotesEditor };
