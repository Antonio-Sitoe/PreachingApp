import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import NoContent from '../../NoContent';
import CardWithButton from './CardWithButton';

import { FlashList } from '@shopify/flash-list';
import { Text, View } from '../../Themed';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { reportsActions } from '@/database/actions';
import { useReportsData } from '@/contexts/ReportContext';
import type { IReport } from '@/database/schemas/reports';
import { AnimatedButton } from '@/components/ui/ButtonAnimated';

export type CardProps = IReport[];

export default function ReportListWithButton() {
  const { isDark } = useTheme();
  const { setisOpenCreateReportModal } = useReportsData();

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['reports', 'paginated', 'withButton'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await reportsActions.getPartialReportData(pageParam, 10);
      return result;
    },
    refetchOnWindowFocus: true,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPage ? nextPage : undefined;
    },
  });

  const allReports = data?.pages.flatMap((page) => page.data) || [];

  if (!isLoading && allReports.length === 0) {
    return <NoContent text="Sem dados" />;
  }

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      {isLoading || isFetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlashList
          data={allReports}
          estimatedItemSize={100}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingRight: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View
              style={{
                backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
              }}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator style={{ marginVertical: 20 }} />
              ) : hasNextPage ? (
                <View
                  className="flex items-center justify-center mt-4"
                  lightColor="transparent"
                >
                  <TouchableOpacity
                    onPress={() => fetchNextPage()}
                    style={{
                      width: 150,
                      backgroundColor: isDark
                        ? Colors.dark.tint
                        : Colors.light.tint,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{
                        color: isDark ? Colors.dark.Success200 : 'white',
                        fontFamily: 'Inter_400Regular',
                        textTransform: 'capitalize',
                        fontSize: 16,
                      }}
                    >
                      Ver mais
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  className="mt-2 font-textIBM text-center"
                  lightColor={Colors.light.tint}
                >
                  Sem mais dados por mostrar 😎
                </Text>
              )}
            </View>
          )}
          renderItem={({ item }) => <CardWithButton data={item} />}
        />
      )}

      <AnimatedButton onPress={() => setisOpenCreateReportModal(true)} />
    </View>
  );
}
