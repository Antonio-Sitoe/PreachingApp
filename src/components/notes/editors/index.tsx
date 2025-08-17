import { useThemeColor } from '@/hooks/useThemeColor';
import { EditorHeader } from '@/components/notes/editors/editor-header';
import { EditorTitle } from './editor-title';
import { EditorRichText } from './editor-rich-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditorOptionsSheet } from './editor-options-sheet';
import { useEffect } from 'react';
import { useEditorStore } from './store';

export function NotesEditor() {
  const store = useEditorStore();
  const backgroundColor = useThemeColor({}, 'background');

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset editor on unmount
  useEffect(() => () => store.resetEditor(), []);

  return (
    <SafeAreaView style={{ backgroundColor, flex: 1 }}>
      <EditorHeader />
      <EditorTitle />
      <EditorRichText />
      <EditorOptionsSheet />
    </SafeAreaView>
  );
}
