import { PausedRow } from '@/components/students/paused-row';
import { QuickStudentSheet } from '@/components/students/quick-student-sheet';
import { SortSheet } from '@/components/students/sort-sheet';
import { StudentFilters } from '@/components/students/student-filters';
import { StudentRow } from '@/components/students/student-row';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import type { StudentFilter, StudentSort } from '@/constants/students';
import { studentsActions, type StudentListItem } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { cn } from '@/utils/cn';
import { getStudentSort, setStudentSort } from '@/utils/storage';
import {
  filterStudents,
  formatStudentCount,
  getSortSummary,
  sortStudents,
} from '@/utils/students/list';
import { FlashList } from '@shopify/flash-list';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentsScreen() {
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<StudentFilter>('all');
  const [sort, setSort] = useState<StudentSort>(getStudentSort);
  const [sorting, setSorting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingName, setCreatingName] = useState<string>();
  const [resumingId, setResumingId] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  const studentsQuery = useQuery({
    queryKey: ['students', 'list'],
    queryFn: studentsActions.getList,
  });

  const all = studentsQuery.data;
  const { refetch } = studentsQuery;
  const search = searchQuery.trim();
  const students = useMemo(
    () => sortStudents(filterStudents(all ?? [], filter, search), sort),
    [all, filter, search, sort]
  );
  const hasStudents = (all?.length ?? 0) > 0;
  const showList = students.length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const openSorting = useCallback(() => setSorting(true), []);

  function startCreating(name?: string) {
    setCreatingName(name);
    setCreating(true);
  }

  function selectSort(value: StudentSort) {
    setSort(value);
    setStudentSort(value);
    setSorting(false);
  }

  async function resume(student: StudentListItem) {
    if (resumingId) return;
    setResumingId(student.id);
    try {
      await studentsActions.resume(student.id);
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      showToast({ message: `${student.displayName} voltou à lista.` });
    } catch {
      showToast({ message: 'Não foi possível retomar. Tenta outra vez.' });
    } finally {
      setResumingId(undefined);
    }
  }

  const footer = useMemo(
    () =>
      filter === 'paused' && showList ? (
        <Text variant="bodyS" className="px-1 pt-5 text-muted-foreground">
          Quem está em pausa sai do Hoje e dos alertas, mas o histórico fica guardado.
        </Text>
      ) : null,
    [filter, showList]
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.primary}
        colors={[theme.primary]}
      />
    ),
    [onRefresh, refreshing, theme.primary]
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <View className="border-b border-border bg-card px-2 pb-2 pt-2">
        <Text variant="titleL" className="py-[9px] text-center">
          Estudantes
        </Text>
      </View>

      <View className="w-full flex-1 self-center" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        {hasStudents ? (
          <View className="px-4">
            <StudentListHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholderColor={theme.subtle}
              filter={filter}
              onFilterChange={setFilter}
              count={students.length}
              sort={sort}
              onSortPress={openSorting}
            />
          </View>
        ) : null}

        {studentsQuery.isLoading && !all ? null : showList ? (
          <FlashList
            style={{ flex: 1 }}
            data={students}
            extraData={resumingId}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{ disabled: true }}
            refreshControl={refreshControl}
            ListFooterComponent={footer}
            renderItem={({ item, index }) => {
              const first = index === 0;
              const last = index === students.length - 1;
              return item.status === 'paused' ? (
                <PausedRow
                  student={item}
                  first={first}
                  last={last}
                  resuming={resumingId === item.id}
                  onResume={() => resume(item)}
                />
              ) : (
                <StudentRow student={item} first={first} last={last} />
              );
            }}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 112, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: hasStudents ? 'flex-start' : 'center',
              paddingHorizontal: hasStudents ? 16 : 0,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}>
            <View className={cn(hasStudents && 'grow justify-center pb-24')}>
              <StudentEmpty
                hasStudents={hasStudents}
                search={search}
                onCreate={startCreating}
                onClearSearch={() => setSearchQuery('')}
              />
            </View>
          </ScrollView>
        )}
      </View>

      {hasStudents ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
          <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
            <Fab floating accessibilityLabel="Novo contacto" onPress={() => startCreating()} />
          </View>
        </View>
      ) : null}

      <SortSheet
        open={sorting}
        value={sort}
        onSelect={selectSort}
        onClose={() => setSorting(false)}
      />
      <QuickStudentSheet
        open={creating}
        initialName={creatingName}
        onClose={() => setCreating(false)}
      />
    </SafeAreaView>
  );
}

type StudentListHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholderColor: string;
  filter: StudentFilter;
  onFilterChange: (value: StudentFilter) => void;
  count: number;
  sort: StudentSort;
  onSortPress: () => void;
};

function StudentListHeader({
  searchQuery,
  onSearchChange,
  placeholderColor,
  filter,
  onFilterChange,
  count,
  sort,
  onSortPress,
}: StudentListHeaderProps) {
  return (
    <View className="gap-5 pb-2 pt-5">
      <View className="relative justify-center">
        <View className="absolute left-4 z-10" pointerEvents="none">
          <AppIcon name="search" size={20} className="text-subtle" />
        </View>
        <TextInput
          accessibilityLabel="Procurar estudante"
          className="h-[52px] rounded-lg border border-border bg-card pl-[46px] pr-4 font-sans text-[14px] text-foreground"
          placeholder="Procurar pelo nome"
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <StudentFilters value={filter} onChange={onFilterChange} />

      <View className="flex-row items-center gap-2">
        <Text variant="bodyS" className="flex-1 text-muted-foreground">
          {formatStudentCount(count, filter)}
          {filter === 'paused' ? null : (
            <>
              {' · por '}
              <Text variant="bodyS" className="font-sans-semibold text-foreground">
                {getSortSummary(sort)}
              </Text>
            </>
          )}
        </Text>
        <IconButton
          variant="ghost"
          icon="sort"
          accessibilityLabel="Mudar a ordenação"
          onPress={onSortPress}
        />
      </View>
    </View>
  );
}

type StudentEmptyProps = {
  hasStudents: boolean;
  search: string;
  onCreate: (name?: string) => void;
  onClearSearch: () => void;
};

function StudentEmpty({ hasStudents, search, onCreate, onClearSearch }: StudentEmptyProps) {
  if (!hasStudents) {
    return (
      <EmptyState
        className="bg-transparent"
        icon="people"
        title="Ainda não há estudantes"
        description="Regista o primeiro estudante que estás a acompanhar. Só o nome é preciso."
        actionLabel="Novo contacto"
        onActionPress={() => onCreate()}
      />
    );
  }

  if (search) {
    return (
      <View className="items-center gap-1">
        <EmptyState
          className="self-stretch bg-transparent px-0 pb-0"
          icon="search"
          title={`Ninguém com o nome "${search}"`}
          description="Confirma como escreveste, ou regista este estudante agora."
          actionLabel={`Registar "${search}"`}
          onActionPress={() => onCreate(search)}
        />
        <Button variant="ghost" className="min-h-12" onPress={onClearSearch}>
          <Text>Limpar a pesquisa</Text>
        </Button>
      </View>
    );
  }

  return <EmptyState className="bg-transparent px-0" icon="people" title="Ninguém neste filtro" />;
}
