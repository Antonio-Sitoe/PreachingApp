import { useThemeColor } from '@/hooks/useThemeColor';
import { EditorHeader } from '@/components/notes/editors/editor-header';
import { EditorTitle } from './editor-title';
import { EditorRichText } from './editor-rich-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditorOptionsSheet } from './editor-options-sheet';
import { useEffect } from 'react';
import { useEditorStore } from './store';
import { notesActions } from '@/database/actions';
import { useLocalSearchParams } from 'expo-router';

export function NotesEditor() {
  const store = useEditorStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to update the tags count when the modal is ope
  useEffect(() => {
    if (id) {
      notesActions.getById(id).then((note) => {
        if (note) {
          store.set({
            id: note.id,
            title: note.title,
            content: note.contentHtml,
            emoji: note.emoji || '📝',
            colorHex: note.colorHex,
            coverIcon: note.coverIcon as any,
            tags: note.tags || [],
            isOptionsBottomSheetOpen: false,
          });
        }
      });
    }
    return () => {
      store.resetEditor();
    };
  }, [id]);

  return (
    <SafeAreaView style={{ backgroundColor, flex: 1 }}>
      <EditorHeader />
      <EditorTitle />
      <EditorRichText />
      <EditorOptionsSheet />
    </SafeAreaView>
  );
}
