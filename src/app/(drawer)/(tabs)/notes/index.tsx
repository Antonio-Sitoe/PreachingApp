import { View } from '@/components/Themed';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notesActions } from '@/database/actions';
import { useRouter } from 'expo-router';
import {
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import Colors from '@/constants/Colors';
import { Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { useState, useMemo } from 'react';
import { Grid, List, Plus, Search, Mic } from 'lucide-react-native';
import { AnimatedButton } from '@/components/ui/ButtonAnimated';

interface Note {
  id: string;
  title: string;
  emoji: string;
  aiSummary: string;
  contentHtml: string;
  contentJson: string;
  colorHex: string;
  coverUri: string | null;
  studentId: string | null;
  audioUri: string | null;
  audioTranscript: string | null;
  aiCategory: string;
  isArchived: number;
  remoteId: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderIndex: number;
  syncStatus: string;
  deletedAt: Date | null;
  deletedBy: string | null;
  deletedReason: string | null;
  deletedComment: string | null;
  deletedCommentAuthor: string | null;
  deletedCommentAuthorId: string | null;
  deletedCommentAuthorName: string | null;
  deletedCommentAuthorEmail: string | null;
}

function generateFakeData(): Note[] {
  const emojis = ['📝', '📚', '💡', '🎯', '📊', '🔥', '⭐', '🌟', '💯', '🚀'];
  const categories = ['general', 'study', 'work', 'personal', 'ideas'];
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
  ];
  const titles = [
    'Ideias para o projeto',
    'Lista de compras',
    'Reunião da equipe',
    'Estudos de React Native',
    'Planejamento semanal',
    'Receitas favoritas',
    'Viagem de férias',
    'Livros para ler',
    'Metas do mês',
    'Exercícios físicos',
  ];
  const summaries = [
    'Brainstorming de funcionalidades e melhorias para implementar no próximo sprint',
    'Itens essenciais para a semana: frutas, verduras, proteínas e produtos de limpeza',
    'Discussão sobre roadmap, deadlines e distribuição de tarefas entre o time',
    'Conceitos avançados de hooks, navigation e performance optimization',
    'Organização de tarefas, compromissos e objetivos para os próximos 7 dias',
    'Coleção de receitas testadas e aprovadas para diferentes ocasiões',
    'Roteiro detalhado, orçamento e lista de lugares para visitar nas férias',
    'Livros de desenvolvimento pessoal, ficção e técnicos para a biblioteca',
    'Objetivos profissionais e pessoais para alcançar até o final do mês',
    'Rotina de exercícios, horários e acompanhamento de progresso fitness',
  ];

  return Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
    title: titles[index],
    emoji: emojis[index],
    aiSummary: summaries[index],
    contentHtml: `<p>Conteúdo da anotação ${index + 1}</p>`,
    contentJson: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: `Conteúdo da anotação ${index + 1}` },
          ],
        },
      ],
    }),
    colorHex: colors[index],
    coverUri: null,
    studentId: null,
    audioUri: null,
    audioTranscript: null,
    aiCategory: categories[index % categories.length],
    isArchived: 0,
    remoteId: null,
    createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - index * 12 * 60 * 60 * 1000),
    orderIndex: index,
    syncStatus: 'synced',
    deletedAt: null,
    deletedBy: null,
    deletedReason: null,
    deletedComment: null,
    deletedCommentAuthor: null,
    deletedCommentAuthorId: null,
    deletedCommentAuthorName: null,
    deletedCommentAuthorEmail: null,
  }));
}

type ViewMode = 'grid' | 'list';
type FilterTag = 'all' | 'general' | 'study' | 'work' | 'personal' | 'ideas';

export default function NotesHome() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTag>('all');

  const {
    data: allNotes = generateFakeData(),
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: () => generateFakeData(),
    // notesActions.listNotes({
    //   sort: { field: 'updatedAt', direction: 'desc' },
    //   filters: { isArchived: false },
    // }),
  });

  const filteredNotes = useMemo(() => {
    let filtered = allNotes;

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter((note) => note.aiCategory === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.aiSummary.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allNotes, activeFilter, searchQuery]);

  async function handleCreate() {
    const created = await notesActions.createNote({
      title: 'Sem título',
      emoji: '📝',
      colorHex: null,
      coverUri: null,
      studentId: null,
      contentJson: JSON.stringify({
        type: 'doc',
        content: [{ type: 'paragraph' }],
      }),
      contentHtml: '<p></p>',
      audioUri: null,
      audioTranscript: null,
      aiCategory: 'general',
      aiSummary: null,
      isArchived: 0,
      remoteId: null,
    });
    await queryClient.invalidateQueries({ queryKey: ['notes'] });
    router.push({
      pathname: '/note',
      params: { id: created.id },
    });
  }

  function openNote(note: { id: string }) {
    router.push({
      pathname: '/note',
      params: { id: note.id },
    });
  }

  const renderGridItem = (item: Note) => (
    <Pressable
      key={item.id}
      onPress={() => openNote(item)}
      className="mb-4 rounded-2xl p-4"
      style={{
        backgroundColor: item.colorHex,
        minHeight: 180,
        width: '47%',
        marginHorizontal: '1%',
      }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <Text className="text-2xl">{item.emoji ?? '📝'}</Text>
        <View className="w-6 h-6 rounded-full bg-white/20" />
      </View>

      <View className="flex-1 justify-between">
        <View>
          <Text
            className="text-white font-bold text-lg mb-2 leading-5"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text className="text-white/90 text-sm leading-4" numberOfLines={3}>
            {item.aiSummary ?? 'Sem resumo disponível'}
          </Text>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-white/70 text-xs font-medium">
            {new Date(item.updatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}
          </Text>
          <View className="px-2 py-1 rounded-lg bg-white/20">
            <Text className="text-white/90 text-xs font-medium capitalize">
              {item.aiCategory}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderListItem = ({ item }: { item: Note }) => (
    <Pressable
      onPress={() => openNote(item)}
      className="mb-3 w-full rounded-xl p-4 flex-row items-center shadow"
      style={{ backgroundColor: isDark ? '#1c1c1e' : '#fff' }}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: item.colorHex }}
      >
        <Text className="text-xl">{item.emoji ?? '📝'}</Text>
      </View>

      <View className="flex-1">
        <Text
          className={`font-semibold text-base mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {item.title}
        </Text>
        <Text
          className={`text-sm mb-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
          numberOfLines={2}
        >
          {item.aiSummary ?? 'Sem resumo disponível'}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
          </Text>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: item.colorHex + '20' }}
          >
            <Text
              className="text-xs capitalize"
              style={{ color: item.colorHex }}
            >
              {item.aiCategory}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 px-4 pt-5" lightColor="#F6F6F9">
      <View className="mb-4 flex-row items-center justify-between mx-4">
        <Text className="font-title text-2xl">Tirar Anotações</Text>

        <View className="flex-row items-center gap-2">
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

      {/* Search Input */}
      <View className="mx-4 mb-4">
        <View
          className="flex-row items-center px-4 py-3 rounded-xl"
          style={{
            backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
          }}
        >
          <Search size={20} color={isDark ? '#8e8e93' : '#8e8e93'} />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search here"
            placeholderTextColor={isDark ? '#8e8e93' : '#8e8e93'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              color: isDark ? '#ffffff' : '#000000',
              fontFamily: 'System',
            }}
          />
          <TouchableOpacity className="ml-2">
            <Mic size={20} color={isDark ? '#8e8e93' : '#8e8e93'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tags */}
      <View className="mx-4 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          className="flex-row"
        >
          {[
            { key: 'all', label: 'Notes', count: allNotes.length },
            {
              key: 'study',
              label: 'To Do',
              count: allNotes.filter((n) => n.aiCategory === 'study').length,
            },
            {
              key: 'general',
              label: 'Blog',
              count: allNotes.filter((n) => n.aiCategory === 'general').length,
            },
            {
              key: 'work',
              label: 'Work',
              count: allNotes.filter((n) => n.aiCategory === 'work').length,
            },
            {
              key: 'personal',
              label: 'Personal',
              count: allNotes.filter((n) => n.aiCategory === 'personal').length,
            },
            {
              key: 'ideas',
              label: 'Ideas',
              count: allNotes.filter((n) => n.aiCategory === 'ideas').length,
            },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key as FilterTag)}
              className="mr-3 px-4 py-2 rounded-full"
              style={{
                backgroundColor:
                  activeFilter === filter.key
                    ? isDark
                      ? Colors.dark.tint
                      : Colors.light.tint
                    : isDark
                    ? '#2c2c2e'
                    : '#f2f2f7',
              }}
            >
              <Text
                className="font-medium"
                style={{
                  color:
                    activeFilter === filter.key
                      ? '#ffffff'
                      : isDark
                      ? '#ffffff'
                      : '#000000',
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
              <Text className="opacity-60 text-center text-lg">📝</Text>
              <Text className="opacity-60 text-center mt-2">
                {searchQuery || activeFilter !== 'all'
                  ? 'Nenhuma anotação encontrada'
                  : 'Sem anotações'}
              </Text>
              <Text className="opacity-40 text-center text-sm mt-1">
                {searchQuery || activeFilter !== 'all'
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Toque em "Nova" para criar sua primeira anotação'}
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
              <Text className="opacity-60 text-center text-lg">📝</Text>
              <Text className="opacity-60 text-center mt-2">
                {searchQuery || activeFilter !== 'all'
                  ? 'Nenhuma anotação encontrada'
                  : 'Sem anotações'}
              </Text>
              <Text className="opacity-40 text-center text-sm mt-1">
                {searchQuery || activeFilter !== 'all'
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Toque em "Nova" para criar sua primeira anotação'}
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
      <AnimatedButton onPress={() => handleCreate()} />
    </View>
  );
}
