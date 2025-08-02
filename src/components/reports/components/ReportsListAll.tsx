import Card from './Card';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import NoContent from '../../NoContent';

import { FlashList } from '@shopify/flash-list';
import { Text, View } from '../../Themed';
import type { IReport } from '@/database/schemas';
import { ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { reportsActions } from '@/database/actions';
import { useReportsData } from '@/contexts/ReportContext';
import { AnimatedButton } from '@/components/ui/ButtonAnimated';

export interface Reports {
  date: string;
  id: string;
  text: string;
}

export interface ReportDataProps {
  year: string;
  reports: Array<[string, IReport[]]>;
}
export type CardProps = ReportDataProps[];

export default function ReportsListAll() {
  const { isDark } = useTheme();
  const { setisOpenCreateReportModal } = useReportsData();
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['reports', 'all', 'grouped'],
    queryFn: async () => {
      const result = await reportsActions.getAllAndGroupByYearAndMonth();
      return result;
    },
  });

  const allReports = data?.data || [];

  if (isLoading || isRefetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

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
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlashList
          data={allReports}
          estimatedItemSize={300}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingRight: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
          keyExtractor={(item: any, i) => item.year + i}
          renderItem={({ item }: { item: any }) => (
            <Card isDark={isDark} data={item.reports} year={item.year} />
          )}
          ListFooterComponent={() => (
            <View
              style={{
                backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
              }}
            >
              <Text
                className="mt-2 font-textIBM text-center"
                lightColor={Colors.light.tint}
              >
                Sem mais dados por mostrar 😎
              </Text>
            </View>
          )}
        />
      )}

      <AnimatedButton onPress={() => setisOpenCreateReportModal(true)} />
    </View>
  );
}
