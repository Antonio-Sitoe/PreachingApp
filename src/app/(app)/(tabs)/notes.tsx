import { AlertDialog } from '@/components/ui/alert-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { DEFAULT_NOTE_COLOR } from '@/components/notes/colors';
import { ListCard, TagsFilter } from '@/components/notes/list';
import { useTags } from '@/components/notes/tags';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { notesActions } from '@/database/actions';
import type { NoteListItem } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { FlashList } from '@shopify/flash-list';
import { keepPreviousData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 20;

export default function NotesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigating = useRef(false);
  const openCard = useRef<{ id: string; close: () => void } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ note: NoteListItem; close: () => void } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const tags = useTags();
  const tagId = tags.some((item) => item.id === activeFilter) ? activeFilter : undefined;
  const search = searchQuery.trim() || undefined;

  const notesQuery = useInfiniteQuery({
    queryKey: ['notes', tagId ?? 'all', search ?? ''],
    queryFn: ({ pageParam }) => notesActions.getPage(pageParam, PAGE_SIZE, tagId, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, page) => (page + 1 < lastPage.totalPage ? page + 1 : undefined),
    placeholderData: keepPreviousData,
  });

  const notes = notesQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const filtered = search !== undefined || tagId !== undefined;

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await notesQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCreate() {
    if (navigating.current || isCreating) return;
    navigating.current = true;
    setIsCreating(true);

    try {
      const note = await notesActions.createNote({
        title: '',
        body: '',
        tagId: tagId ?? null,
        color: DEFAULT_NOTE_COLOR,
        studentId: null,
        remoteId: null,
      });
      if (!note) throw new Error('empty');
      router.push({ pathname: '/note/[id]', params: { id: note.id } });
    } catch {
      navigating.current = false;
      showToast({ message: 'Não foi possível criar a nota.' });
    } finally {
      setIsCreating(false);
    }
  }

  function cardOpened(id: string, close: () => void) {
    if (openCard.current && openCard.current.id !== id) openCard.current.close();
    openCard.current = { id, close };
  }

  function cancelDelete() {
    pendingDelete?.close();
    setPendingDelete(null);
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await notesActions.deleteNote(pendingDelete.note.id);
      openCard.current = null;
      setPendingDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch {
      showToast({ message: 'Não foi possível apagar a nota.' });
      cancelDelete();
    } finally {
      setDeleting(false);
    }
  }

  function openNote(note: NoteListItem) {
    if (navigating.current) return;
    navigating.current = true;
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  }

  const header = (
    <View className="gap-5 pb-5 pt-5">
      <View className="relative justify-center">
        <View className="absolute left-4 z-10" pointerEvents="none">
          <AppIcon name="search" size={20} className="text-subtle" />
        </View>
        <TextInput
          accessibilityLabel="Procurar nas notas"
          className="h-[52px] rounded-lg border border-border bg-card pl-[46px] pr-4 font-sans text-[14px] text-foreground"
          placeholder="Procurar"
          placeholderTextColor={theme.subtle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      <TagsFilter
        tags={tags}
        activeFilter={tagId ?? 'all'}
        onFilterChange={setActiveFilter}
      />
    </View>
  );

  const empty =
    notesQuery.isLoading && notes.length === 0 ? null : (
      <View className="pb-10 pt-16">
        <EmptyState
          className="bg-transparent"
          icon="notes"
          title={filtered ? 'Nenhuma nota encontrada' : 'Ainda não há notas'}
          description={
            filtered
              ? 'Tenta ajustar a pesquisa ou os filtros.'
              : 'Guarda aqui ideias para a pregação, pontos de um discurso ou o que quiseres lembrar.'
          }
          actionLabel={filtered ? undefined : 'Nova nota'}
          onActionPress={filtered ? undefined : handleCreate}
        />
      </View>
    );

  const showFab = notes.length > 0 || filtered;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <View className="border-b border-border bg-card px-2 pb-2 pt-2">
        <Text variant="titleL" className="py-[9px] text-center">
          Notas
        </Text>
      </View>

      <View className="w-full flex-1 self-center" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <FlashList
          style={{ flex: 1 }}
          data={notes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          onEndReached={() => {
            if (notesQuery.hasNextPage && !notesQuery.isFetchingNextPage) void notesQuery.fetchNextPage();
          }}
          ListHeaderComponent={header}
          onScrollBeginDrag={() => {
            openCard.current?.close();
            openCard.current = null;
          }}
          renderItem={({ item }) => (
            <ListCard
              key={item.id}
              note={item}
              onPress={() => openNote(item)}
              onOpen={(close) => cardOpened(item.id, close)}
              onDelete={(close) => setPendingDelete({ note: item, close })}
            />
          )}
          ListEmptyComponent={empty}
          contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {showFab ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
          <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
            <Fab floating accessibilityLabel="Nova nota" onPress={handleCreate} disabled={isCreating} />
          </View>
        </View>
      ) : null}

      <AlertDialog
        open={pendingDelete !== null}
        onClose={cancelDelete}
        icon="trash"
        tone="destructive"
        title="Apagar esta nota?"
        description={`"${pendingDelete?.note.title.trim() || 'Sem título'}" é apagada deste telemóvel. Não dá para desfazer.`}>
        <Button variant="destructive" onPress={confirmDelete} disabled={deleting}>
          <Text>Apagar nota</Text>
        </Button>
        <Button variant="ghost" onPress={cancelDelete} disabled={deleting}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </SafeAreaView>
  );
}
