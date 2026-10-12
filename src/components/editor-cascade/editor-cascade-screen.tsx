import {
  EditorCascadeView,
  type EditorCascadeViewRef,
} from '@/components/editor-cascade/native-view';
import { clearDocument, readDocument, writeDocument } from '@/components/editor-cascade/storage';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { THEME } from '@/lib/theme';
import { useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Share, View } from 'react-native';

/** Ecrã de teste do Cascade Editor, para comparar com o editor v3. */
export function EditorCascadeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const editorRef = useRef<EditorCascadeViewRef>(null);
  const leaving = useRef(false);

  // Lido uma vez: a partir daqui o editor nativo é a fonte e o JS só grava o que ele envia.
  // Trocar o documentId (no "recomeçar") faz o nativo voltar a ler o initialDocument.
  const [session, setSession] = useState(() => ({ id: 'cascade-0', document: readDocument() }));

  const save = useCallback((json: string | null | undefined) => {
    if (json) writeDocument(json);
  }, []);

  // Antes de sair, pede o documento ao nativo para não perder o que ainda está no debounce.
  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (leaving.current) return;
      event.preventDefault();
      leaving.current = true;
      const pending = editorRef.current?.getDocument() ?? Promise.resolve(null);
      pending
        .then(save)
        .catch(() => undefined)
        .finally(() => navigation.dispatch(event.data.action));
    });
  }, [navigation, save]);

  async function exportMarkdown() {
    const markdown = await editorRef.current?.getMarkdown().catch(() => null);
    if (!markdown) return;
    await Share.share({ title: 'Cascade Editor', message: markdown }).catch(() => undefined);
  }

  function reset() {
    clearDocument();
    setSession({ id: `cascade-${Date.now()}`, document: '' });
  }

  return (
    <View className="flex-1 bg-card">
      <ScreenHeader
        title="Cascade Editor"
        onBack={() => router.back()}
        right={
          <View className="flex-row">
            <IconButton
              icon="trash"
              variant="ghost"
              accessibilityLabel="Recomeçar documento"
              onPress={reset}
            />
            <IconButton
              icon="file"
              variant="ghost"
              accessibilityLabel="Exportar Markdown"
              onPress={exportMarkdown}
            />
          </View>
        }
      />
      <EditorCascadeView
        ref={editorRef}
        style={{ flex: 1 }}
        documentId={session.id}
        initialDocument={session.document}
        dark={colorScheme === 'dark'}
        foregroundColor={theme.foreground}
        primaryColor={theme.primary}
        onDocumentChange={(event) => save(event.nativeEvent.document)}
      />
    </View>
  );
}
