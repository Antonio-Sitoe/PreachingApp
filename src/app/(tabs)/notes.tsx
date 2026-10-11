import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { NOTE_COLORS } from '@/components/notes/colors';
import { asCoverIcon } from '@/components/notes/cover-icons';
import { GridCard, ListCard, TagsFilter } from '@/components/notes/list';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import type { Note } from '@/database/schemas';
import { THEME } from '@/lib/theme';
import { FlashList } from '@shopify/flash-list';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { LayoutGrid, List, Search, Trash, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ViewMode = 'grid' | 'list';

export default function NotesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigating = useRef(false);

  const { data: tags = [], refetch: refetchTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => notesActions.getTags(),
  });

  const {
    data: filteredNotes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notes', activeFilter, searchQuery],
    queryFn: () =>
      notesActions.getAllNotesWithFilters(
        activeFilter !== 'all' ? activeFilter : undefined,
        searchQuery.trim() || undefined
      ),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchTags();
      navigating.current = false;
    }, [refetch, refetchTags])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = searchQuery.trim().length > 0 || activeFilter !== 'all';

  function openEditor(note: Note) {
    useEditorStore.getState().resetEditor();
    useEditorStore.getState().set({
      id: note.id,
      emoji: note.emoji || '📝',
      title: note.title,
      content: note.contentHtml,
      contentHtml: note.contentHtml,
      colorHex: note.colorHex,
      coverIcon: asCoverIcon(note.coverIcon),
      isArchived: note.isArchived,
      orderIndex: note.orderIndex,
      deletedAt: note.deletedAt,
      syncStatus: note.syncStatus,
      remoteId: note.remoteId,
      tags: [],
      isOptionsBottomSheetOpen: false,
    });
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  }

  async function handleCreate() {
    if (navigating.current || isCreating) return;
    navigating.current = true;
    setIsCreating(true);

    try {
      const note = await notesActions.createNote({
        title: '',
        emoji: '📝',
        colorHex: NOTE_COLORS[0].color,
        coverIcon: null,
        contentHtml: '',
        isArchived: 0,
        remoteId: null,
      });

      if (!note) throw new Error('empty');
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      openEditor(note);
    } catch {
      navigating.current = false;
      showToast({ message: 'Não foi possível criar a nota.' });
    } finally {
      setIsCreating(false);
    }
  }

  function openNote(note: Note) {
    if (navigating.current) return;
    if (isSelecting) {
      toggleSelect(note.id);
      return;
    }
    navigating.current = true;
    openEditor(note);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) setIsSelecting(false);
      return next;
    });
  }

  function startSelection(id: string) {
    setIsSelecting(true);
    setSelectedIds(new Set([id]));
  }

  function cancelSelection() {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }

  async function deleteSelected() {
    const ids = [...selectedIds];
    setConfirmDelete(false);
    try {
      await Promise.all(ids.map((id) => notesActions.deleteNote(id, true)));
      cancelSelection();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch {
      showToast({ message: 'Não foi possível apagar as notas.' });
    }
  }

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
  );

  const empty =
    isLoading && filteredNotes.length === 0 ? (
      <View className="flex-1" />
    ) : (
      <View className="px-4 py-8">
        <EmptyState
          icon="notes"
          title={filtered ? 'Nenhuma nota encontrada' : 'Ainda não há notas'}
          description={
            filtered
              ? 'Tenta ajustar a pesquisa ou os filtros.'
              : 'Escreve o que conversaram para te lembrares na próxima visita.'
          }
        />
      </View>
    );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <View className="w-full flex-1 self-center" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <View className="mb-3 flex-row items-center justify-between px-4 pt-2">
          <Text variant="titleXl">Notas</Text>
          <View className="flex-row items-center gap-2">
            {isSelecting ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Apagar notas escolhidas"
                  onPress={() => setConfirmDelete(true)}
                  className="size-11 items-center justify-center rounded-full bg-destructive-soft">
                  <Trash size={20} color={theme.destructive} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar seleção"
                  onPress={cancelSelection}
                  className="size-11 items-center justify-center rounded-full bg-muted">
                  <X size={20} color={theme.foreground} />
                </Pressable>
              </>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={viewMode === 'grid' ? 'Ver em lista' : 'Ver em grelha'}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="size-11 items-center justify-center rounded-full bg-muted">
              {viewMode === 'grid' ? (
                <List size={20} color={theme.foreground} />
              ) : (
                <LayoutGrid size={20} color={theme.foreground} />
              )}
            </Pressable>
          </View>
        </View>

        <View className="mx-4 mb-3 h-12 flex-row items-center rounded-lg bg-muted px-4">
          <Search size={20} color={theme.subtle} />
          <TextInput
            accessibilityLabel="Pesquisar notas"
            className="ml-3 flex-1 font-sans text-[14px] text-foreground"
            placeholder="Pesquisar notas"
            placeholderTextColor={theme.subtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>

        <TagsFilter tags={tags} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {viewMode === 'grid' ? (
          <ScrollView
            className="flex-1"
            refreshControl={refreshControl}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-4 pb-28">
            {filteredNotes.length === 0 ? (
              empty
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {filteredNotes.map((note) => (
                  <GridCard
                    key={note.id}
                    note={note}
                    isSelecting={isSelecting}
                    isSelected={selectedIds.has(note.id)}
                    onPress={() => openNote(note)}
                    onLongPress={() => startSelection(note.id)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        ) : (
          <FlashList
            style={{ flex: 1 }}
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            extraData={{ isSelecting, selectedSize: selectedIds.size }}
            refreshControl={refreshControl}
            renderItem={({ item }) => (
              <ListCard
                note={item}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(item.id)}
                onPress={() => openNote(item)}
                onLongPress={() => startSelection(item.id)}
              />
            )}
            ListEmptyComponent={empty}
            contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
        <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
          <Fab
            floating
            accessibilityLabel="Nova nota"
            onPress={handleCreate}
            disabled={isCreating}
          />
        </View>
      </View>

      <AlertDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        icon="alert"
        tone="destructive"
        title="Apagar notas"
        description={`Apagar ${selectedIds.size} ${selectedIds.size === 1 ? 'nota' : 'notas'}?`}>
        <Button variant="destructive" onPress={deleteSelected}>
          <Text>Apagar</Text>
        </Button>
        <Button variant="neutral" onPress={() => setConfirmDelete(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </SafeAreaView>
  );
}
