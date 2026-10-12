import { ListCard } from '@/components/10tap-editor/list-card';
import {
  createTentapNote,
  deleteTentapNote,
  listTentapNotes,
  type TentapNote,
} from '@/components/10tap-editor/storage';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function TentapNotesList() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<TentapNote[]>([]);
  const [pendingDelete, setPendingDelete] = useState<TentapNote | null>(null);
  const navigating = useRef(false);

  const reload = useCallback(() => setNotes(listTentapNotes(search.trim() || undefined)), [search]);

  // Ao voltar do editor a lista é lida outra vez: o MMKV é síncrono e local.
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
      reload();
    }, [reload])
  );

  function openNote(id: string) {
    if (navigating.current) return;
    navigating.current = true;
    router.push({ pathname: '/tentap-notes/[id]', params: { id } });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteTentapNote(pendingDelete.id);
    setPendingDelete(null);
    reload();
  }

  const filtered = search.trim() !== '';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <View className="flex-row items-center border-b border-border bg-card px-2 pb-2 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          className="size-11 items-center justify-center rounded-full active:bg-muted">
          <AppIcon name="chevron-left" size={24} />
        </Pressable>
        <Text variant="titleL" className="flex-1 py-[9px] text-center">
          Notas 10tap
        </Text>
        <View className="size-11" />
      </View>

      <View className="w-full flex-1 self-center" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View className="relative justify-center pb-5 pt-5">
              <View className="absolute left-4 z-10" pointerEvents="none">
                <AppIcon name="search" size={20} className="text-subtle" />
              </View>
              <TextInput
                accessibilityLabel="Procurar nas notas"
                className="h-[52px] rounded-lg border border-border bg-card pl-[46px] pr-4 font-sans text-[14px] text-foreground"
                placeholder="Procurar"
                placeholderTextColor={theme.subtle}
                value={search}
                onChangeText={(value) => {
                  setSearch(value);
                  setNotes(listTentapNotes(value.trim() || undefined));
                }}
                autoCorrect={false}
                returnKeyType="search"
              />
            </View>
          }
          renderItem={({ item }) => (
            <ListCard note={item} onPress={() => openNote(item.id)} onLongPress={() => setPendingDelete(item)} />
          )}
          ListEmptyComponent={
            <View className="pb-10 pt-16">
              <EmptyState
                className="bg-transparent"
                icon="notes"
                title={filtered ? 'Nenhuma nota encontrada' : 'Ainda não há notas'}
                description={
                  filtered
                    ? 'Tenta outra pesquisa.'
                    : 'Notas escritas com o editor 10tap. Ficam guardadas à parte das outras notas.'
                }
                actionLabel={filtered ? undefined : 'Nova nota'}
                onActionPress={filtered ? undefined : () => openNote(createTentapNote().id)}
              />
            </View>
          }
          contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {notes.length > 0 || filtered ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
          <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
            <Fab floating accessibilityLabel="Nova nota" onPress={() => openNote(createTentapNote().id)} />
          </View>
        </View>
      ) : null}

      <AlertDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        icon="trash"
        tone="destructive"
        title="Apagar esta nota?"
        description={`"${pendingDelete?.title.trim() || 'Sem título'}" é apagada deste telemóvel. Não dá para desfazer.`}>
        <Button variant="destructive" onPress={confirmDelete}>
          <Text>Apagar nota</Text>
        </Button>
        <Button variant="ghost" onPress={() => setPendingDelete(null)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </SafeAreaView>
  );
}

export { TentapNotesList };
