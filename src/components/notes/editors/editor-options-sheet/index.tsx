import { AlertDialog } from '@/components/ui/alert-dialog';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { ActionsSection } from '@/components/notes/editors/editor-options-sheet/actions';
import { ColorsPalette } from '@/components/notes/editors/editor-options-sheet/colors-palette';
import { IconsSection } from '@/components/notes/editors/editor-options-sheet/icons-section';
import { TagsSheet } from '@/components/notes/editors/editor-options-sheet/tags-sheet';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';

function EditorOptionsSheet() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const open = useEditorStore((state) => state.isOptionsBottomSheetOpen);
  const set = useEditorStore((state) => state.set);
  const resetEditor = useEditorStore((state) => state.resetEditor);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { height } = useWindowDimensions();

  async function deleteNote() {
    const id = useEditorStore.getState().id;
    if (!id) return;
    setConfirmDelete(false);
    try {
      await notesActions.deleteNote(id, true);
      resetEditor();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    } catch {
      showToast({ message: 'Não foi possível apagar a nota.' });
    }
  }

  return (
    <>
      <BottomSheet open={open} onClose={() => set({ isOptionsBottomSheetOpen: false })} title="Opções da nota">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: height * 0.62 }}
          contentContainerClassName="gap-6">
          <ColorsPalette />
          <IconsSection />
          <ActionsSection
            onOpenTags={() => {
              set({ isOptionsBottomSheetOpen: false });
              setTagsOpen(true);
            }}
            onAskDelete={() => {
              set({ isOptionsBottomSheetOpen: false });
              setConfirmDelete(true);
            }}
          />
        </ScrollView>
      </BottomSheet>
      <TagsSheet open={tagsOpen} onClose={() => setTagsOpen(false)} />
      <AlertDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        icon="alert"
        tone="destructive"
        title="Apagar nota"
        description="Esta nota deixa de aparecer na lista.">
        <Button variant="destructive" onPress={deleteNote}>
          <Text>Apagar</Text>
        </Button>
        <Button variant="neutral" onPress={() => setConfirmDelete(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </>
  );
}

export { EditorOptionsSheet };
