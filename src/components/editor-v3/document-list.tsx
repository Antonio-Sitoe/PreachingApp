import { createDocument, deleteDocument, listDocuments } from '@/components/editor-v3/storage';
import type { EditorV3Document } from '@/components/editor-v3/types';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import '@/lib/dayjs';
import dayjs from 'dayjs';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

export function EditorV3DocumentList() {
  const router = useRouter();
  const [documents, setDocuments] = useState<EditorV3Document[]>([]);
  const [toDelete, setToDelete] = useState<EditorV3Document | null>(null);

  useFocusEffect(
    useCallback(() => {
      setDocuments(listDocuments());
    }, [])
  );

  function openDocument(id: string) {
    router.push({ pathname: '/editor-v3/[id]', params: { id } });
  }

  function createAndOpen() {
    openDocument(createDocument().id);
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteDocument(toDelete.id);
    setToDelete(null);
    setDocuments(listDocuments());
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Editor v3" onBack={() => router.back()} />
      {documents.length === 0 ? (
        <View className="w-full max-w-[640px] flex-1 justify-center self-center px-4">
          <EmptyState
            icon="notes"
            title="Ainda não há documentos"
            description="Editor em blocos nativo (Compose). Os documentos ficam só neste aparelho."
            actionLabel="Novo documento"
            onActionPress={createAndOpen}
          />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          contentContainerClassName="w-full max-w-[640px] gap-2 self-center px-4 pb-28 pt-4"
          renderItem={({ item }) => (
            <DocumentRow
              document={item}
              onPress={() => openDocument(item.id)}
              onLongPress={() => setToDelete(item)}
            />
          )}
        />
      )}
      {documents.length > 0 ? (
        <Fab floating accessibilityLabel="Novo documento" onPress={createAndOpen} />
      ) : null}
      <AlertDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        icon="trash"
        tone="destructive"
        title="Apagar este documento?"
        description={`"${toDelete?.title || 'Sem título'}" é apagado deste telemóvel. Não dá para desfazer.`}>
        <Button variant="destructive" onPress={confirmDelete}>
          <Text>Apagar documento</Text>
        </Button>
        <Button variant="ghost" onPress={() => setToDelete(null)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </View>
  );
}

function DocumentRow({
  document,
  onPress,
  onLongPress,
}: {
  document: EditorV3Document;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const blocks = document.blocks.length;
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="gap-1 rounded-lg border border-border bg-card px-4 py-3 active:bg-secondary">
      <Text variant="titleS" numberOfLines={1}>
        {document.title || 'Sem título'}
      </Text>
      <Text variant="bodyS" className="text-muted-foreground">
        {dayjs(document.updatedAt).format('D MMM YYYY, HH:mm')} · {blocks}{' '}
        {blocks === 1 ? 'bloco' : 'blocos'}
      </Text>
    </Pressable>
  );
}
