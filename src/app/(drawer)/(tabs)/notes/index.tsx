import { View } from '@/components/Themed';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notesActions } from '@/database/actions';
import { useRouter } from 'expo-router';
import { TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import Colors from '@/constants/Colors';
import { Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Grid, List, Search, Trash2, X } from 'lucide-react-native';
import { AnimatedButton } from '@/components/ui/ButtonAnimated';
import {
  type IconName,
  useEditorStore,
} from '@/components/notes/editors/store';
import { useIsFocused } from '@react-navigation/native';
import type { Note } from '@/database/schemas';
import { GridCard, ListCard, TagsFilter } from '@/components/notes/list';

type ViewMode = 'grid' | 'list';

export default function NotesHome() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const store = useEditorStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isFocused) {
      setIsNavigating(false);
      setIsCreating(false);
    }
  }, [isFocused]);

  const { data: tags = [] } = useQuery({
    queryKey: ['tags', isFocused],
    queryFn: () => notesActions.getTags(),
  });

  const {
    data: filteredNotes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notes', activeFilter, searchQuery, isFocused],
    queryFn: async () => {
      const tagId = activeFilter !== 'all' ? activeFilter : undefined;
      return await notesActions.getAllNotesWithFilters(
        tagId,
        searchQuery.trim() || undefined
      );
    },
  });

  async function handleCreate() {
    if (isNavigating) return;

    setIsCreating(true);
    setIsNavigating(true);

    try {
      store.resetEditor();

      const note = await notesActions.createNote({
        title: '',
        emoji: '📝',
        colorHex: '#A1CEDC',
        coverIcon: null,
        contentHtml: '',
        isArchived: 0,
        remoteId: null,
      });

      store.set({
        id: note?.id,
        emoji: note?.emoji || undefined,
        title: note?.title,
        content: note?.contentHtml,
        colorHex: note?.colorHex,
        isOptionsBottomSheetOpen: false,
        tags: [], // Inicializar tags como array vazio
      });

      router.push({
        pathname: '/note',
        params: { id: note?.id },
      });

      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (error) {
      console.error('❌ Erro ao criar anotação:', error);
      setIsNavigating(false);
    } finally {
      setIsCreating(false);
      setTimeout(() => setIsNavigating(false), 500);
    }
  }

  function openNote(note: Note) {
    if (isNavigating) return;

    if (isSelecting) {
      toggleSelect(note.id);
      return;
    }

    setIsNavigating(true);

    store.resetEditor();

    store.set({
      id: note?.id,
      emoji: note?.emoji || undefined,
      title: note?.title,
      content: note?.contentHtml,
      colorHex: note?.colorHex,
      isOptionsBottomSheetOpen: false,
      coverIcon: note?.coverIcon as IconName,
    });

    router.push({
      pathname: '/note',
      params: { id: note.id },
    });

    setTimeout(() => setIsNavigating(false), 500);
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
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    Alert.alert('Apagar anotações', `Apagar ${ids.length} anotação(ões)?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await Promise.all(
              ids.map((id) => notesActions.deleteNote(id, true))
            );
          } finally {
            setSelectedIds(new Set());
            setIsSelecting(false);
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
          }
        },
      },
    ]);
  }

  const renderGridItem = (item: Note) => {
    const selected = selectedIds.has(item.id);
    return (
      <GridCard
        key={item.id}
        note={item}
        isSelecting={isSelecting}
        isSelected={selected}
        onPress={() => (isSelecting ? toggleSelect(item.id) : openNote(item))}
        onLongPress={() => startSelection(item.id)}
      />
    );
  };

  const renderListItem = ({ item }: { item: Note }) => {
    const selected = selectedIds.has(item.id);
    return (
      <ListCard
        note={item}
        isSelecting={isSelecting}
        isSelected={selected}
        onPress={() => (isSelecting ? toggleSelect(item.id) : openNote(item))}
        onLongPress={() => startSelection(item.id)}
      />
    );
  };

  return (
    <View className="flex-1 px-4 pt-5" lightColor="#F6F6F9">
      <View className="mb-4 flex-row items-center justify-between mx-4">
        <Text className="font-title text-3xl font-bold">Anotações</Text>

        <View className="flex-row items-center gap-2">
          {isSelecting && (
            <>
              <TouchableOpacity
                onPress={deleteSelected}
                className="p-2 rounded-lg"
                style={{ backgroundColor: isDark ? '#3f1d1d' : '#fee2e2' }}
              >
                <Trash2 size={20} color={isDark ? '#ff6b6b' : '#dc2626'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelSelection}
                className="p-2 rounded-lg"
                style={{ backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7' }}
              >
                <X size={20} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
            }}
          >
            {viewMode === 'grid' ? (
              <List size={20} color={isDark ? '#fff' : '#000'} />
            ) : (
              <Grid size={20} color={isDark ? '#fff' : '#000'} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="mx-4 mb-4">
        <View
          className="flex-row items-center px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isDark ? '#1c1c1e' : '#e5e5ea',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Search size={20} color={isDark ? '#8e8e93' : '#8e8e93'} />
          <TextInput
            className="flex-1 ml-3 font-text text-base"
            placeholder="Pesquisar suas anotações..."
            placeholderTextColor={isDark ? '#8e8e93' : '#8e8e93'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              color: isDark ? '#ffffff' : '#000000',
            }}
          />
        </View>
      </View>

      <TagsFilter
        tags={tags}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {viewMode === 'grid' && (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.dark.tint]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 60,
            paddingHorizontal: 8,
          }}
        >
          {filteredNotes.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="opacity-60 text-center text-6xl mb-4">📝</Text>
              <Text className="font-title text-xl font-bold opacity-60 text-center mb-2">
                {searchQuery || activeFilter !== 'all'
                  ? 'Nenhuma anotação encontrada'
                  : 'Suas anotações aparecerão aqui'}
              </Text>
              <Text className="font-text text-base opacity-40 text-center px-8">
                {searchQuery || activeFilter !== 'all'
                  ? 'Tente ajustar sua busca ou filtros para encontrar o que procura'
                  : 'Comece criando sua primeira anotação tocando no botão +'}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredNotes.map((item) => renderGridItem(item))}
            </View>
          )}
        </ScrollView>
      )}

      {viewMode === 'list' && (
        <FlashList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
          numColumns={1}
          extraData={{ isSelecting, selectedIdsSize: selectedIds.size }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.dark.tint]}
            />
          }
          renderItem={renderListItem}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="opacity-60 text-center text-6xl mb-4">📝</Text>
              <Text className="font-title text-xl font-bold opacity-60 text-center mb-2">
                {searchQuery || activeFilter !== 'all'
                  ? 'Nenhuma anotação encontrada'
                  : 'Suas anotações aparecerão aqui'}
              </Text>
              <Text className="font-text text-base opacity-40 text-center px-8">
                {searchQuery || activeFilter !== 'all'
                  ? 'Tente ajustar sua busca ou filtros para encontrar o que procura'
                  : 'Comece criando sua primeira anotação tocando no botão +'}
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 60,
            paddingHorizontal: 8,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <AnimatedButton
        onPress={() => handleCreate()}
        isLoading={isCreating || isNavigating}
      />
    </View>
  );
}
