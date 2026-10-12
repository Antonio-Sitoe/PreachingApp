import { documentTitle, documentToMarkdown } from '@/components/editor-v3/markdown';
import { EditorV3View, type EditorV3ViewRef } from '@/components/editor-v3/native-view';
import { deleteIfEmpty, getDocument, saveDocumentContent } from '@/components/editor-v3/storage';
import type { EditorV3Content } from '@/components/editor-v3/types';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { showToast } from '@/components/ui/toast';
import { THEME } from '@/lib/theme';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Share, View } from 'react-native';

function parseContent(json: string | null | undefined): EditorV3Content | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as EditorV3Content;
  } catch {
    return null;
  }
}

export function EditorV3Screen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const editorRef = useRef<EditorV3ViewRef>(null);
  const leaving = useRef(false);

  // Lido uma vez: a partir daqui o editor nativo é a fonte e o JS só grava o que ele envia.
  const [doc] = useState(() => (id ? getDocument(id) : null));
  const [initialDocument] = useState(() =>
    doc ? JSON.stringify({ version: 1, blocks: doc.blocks } satisfies EditorV3Content) : ''
  );

  useEffect(() => {
    if (doc) return;
    showToast({ message: 'Este documento já não existe.' });
    router.back();
  }, [doc, router]);

  const save = useCallback(
    (json: string | null | undefined) => {
      const content = parseContent(json);
      if (id && content) saveDocumentContent(id, content);
    },
    [id]
  );

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
        .finally(() => {
          if (id) deleteIfEmpty(id);
          navigation.dispatch(event.data.action);
        });
    });
  }, [navigation, save, id]);

  async function exportMarkdown() {
    const content =
      parseContent(await editorRef.current?.getDocument().catch(() => null)) ??
      (doc ? { version: 1 as const, blocks: doc.blocks } : null);
    if (!content) return;
    await Share.share({
      title: documentTitle(content) || 'Documento',
      message: documentToMarkdown(content),
    }).catch(() => undefined);
  }

  if (!doc) return <View className="flex-1 bg-card" />;

  return (
    <View className="flex-1 bg-card">
      <ScreenHeader
        title="Editor v3"
        onBack={() => router.back()}
        right={
          <IconButton
            icon="file"
            variant="ghost"
            accessibilityLabel="Exportar Markdown"
            onPress={exportMarkdown}
          />
        }
      />
      <EditorV3View
        ref={editorRef}
        style={{ flex: 1 }}
        documentId={doc.id}
        initialDocument={initialDocument}
        placeholder={'Escreve, ou "/" para comandos'}
        foregroundColor={theme.foreground}
        mutedColor={theme.subtle}
        primaryColor={theme.primary}
        surfaceColor={theme.muted}
        cardColor={theme.card}
        borderColor={theme.border}
        destructiveColor={theme.destructive}
        onDocumentChange={(event) => save(event.nativeEvent.document)}
      />
    </View>
  );
}
