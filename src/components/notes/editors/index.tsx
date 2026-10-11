import { EditorHeader } from '@/components/notes/editors/editor-header';
import { EditorOptionsSheet } from '@/components/notes/editors/editor-options-sheet';
import { EditorRichText } from '@/components/notes/editors/editor-rich-text';
import { EditorTitle } from '@/components/notes/editors/editor-title';
import { useEditorStore } from '@/components/notes/editors/store';
import { asCoverIcon } from '@/components/notes/cover-icons';
import { notesActions } from '@/database/actions';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function NotesEditor() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) return;
    let active = true;

    notesActions.getById(id).then((note) => {
      if (!active || !note) return;
      useEditorStore.getState().set({
        id: note.id,
        title: note.title,
        content: note.contentHtml,
        contentHtml: note.contentHtml,
        emoji: note.emoji || '📝',
        colorHex: note.colorHex,
        coverIcon: asCoverIcon(note.coverIcon),
        isArchived: note.isArchived,
        orderIndex: note.orderIndex,
        deletedAt: note.deletedAt,
        syncStatus: note.syncStatus,
        remoteId: note.remoteId,
        tags: note.tags,
        isOptionsBottomSheetOpen: false,
      });
    });

    return () => {
      active = false;
      useEditorStore.getState().resetEditor();
    };
  }, [id]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <EditorHeader />
      <EditorTitle />
      <View className="flex-1">
        <EditorRichText />
      </View>
      <EditorOptionsSheet />
    </SafeAreaView>
  );
}

export { NotesEditor };
