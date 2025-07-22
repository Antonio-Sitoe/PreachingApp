import NoContent from '@/components/NoContent';
import { Text, View } from '@/components/Themed';
import { StudentCard } from '@/components/students/StudentCard';
import { AnimatedButtonWithText } from '@/components/ui/ButtonAnimatedV2';
import Colors from '@/constants/Colors';
import { studentsAction } from '@/database/actions';

import useTheme from '@/hooks/useTheme';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import { RefreshControl } from 'react-native-gesture-handler';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 20;

export default function StudentsHome() {
  const router = useRouter();
  const { isDark } = useTheme();
  const isFocused = useIsFocused();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['students'],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      return studentsAction.getAll({ page: pageParam, pageSize: PAGE_SIZE });
    },
    getNextPageParam: (
      lastPage: { data: any[]; total: number },
      allPages: { data: any[]; total: number }[]
    ) => {
      const loaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: isFocused,
  });

  const students = data?.pages.flatMap((page) => page.data) ?? [];

  function handleAddPeople() {
    router.push('/(report)/(tabs)/students/createStudents');
  }

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <Text
          className="font-subTitleIBM text-base"
          lightColor={Colors.light.tint}
        >
          MORADORES, INTERESSADOS E ESTUDANTES
        </Text>
        <View
          darkColor={Colors.dark.tint}
          lightColor={Colors.light.tint}
          className="w-11 h-1 mx-auto rounded-lg mt-2"
        />
      </View>

      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.dark.tint]}
          />
        }
        data={students}
        estimatedItemSize={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
          paddingTop: 20,
        }}
        keyExtractor={(item, i) => i + String(item.id)}
        ListEmptyComponent={() => {
          return (
            <View className="mt-10">
              <NoContent text="Sem dados" />
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <StudentCard
              onViewProfile={() => {
                router.push({
                  pathname: '/(report)/(tabs)/students/profile',
                  params: { id: item.id },
                });
              }}
              onAddVisit={() => {
                router.push({
                  pathname: '/(report)/(tabs)/students/createVisit',
                  params: { id: item.id, name: item?.name },
                });
              }}
              data={item}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? <Text>Carregando mais...</Text> : null
        }
      />

      {/* <AnimatedButtonWithText
        text="Adicionar Pessoa"
        onPress={handleAddPeople}
      /> */}
    </View>
  );
}
