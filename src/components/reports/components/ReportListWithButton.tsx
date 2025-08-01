import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import NoContent from '../../NoContent';
import CardWithButton from './CardWithButton';

import { FlashList } from '@shopify/flash-list';
import { Text, View } from '../../Themed';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { reportsActions } from '@/database/actions';
import { usePathname } from 'expo-router';
import { useReportsData } from '@/contexts/ReportContext';
import { Plus } from 'lucide-react-native';
import { type IReport } from '@/database/schemas/reports';

export type CardProps = IReport[];

export default function ReportListWithButton() {
  const [data, setData] = useState<CardProps>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const [isloadingReportData, setIsLoadingReportData] = useState(true);
  const isPath = usePathname() === '/report';
  console.log('TOTAL DE ITEMS', data.length);

  const { isDark } = useTheme();
  const { setisOpenCreateReportModal } = useReportsData();

  async function handleMoreData() {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      await getallreportDataAsync(newPage, false);
    }
  }

  const getallreportDataAsync = async (page: number, isInitial = false) => {
    setIsLoadingReportData(true);
    try {
      const limit = 10;
      const { data, totalPage } = await reportsActions.getPartialReportData(
        page,
        limit
      );
      if (page < totalPage) {
        if (isInitial) {
          setData(data);
        } else {
          setData((prev) => [...prev, ...data]);
        }
      }
      setTotalPage(totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingReportData(false);
    }
  };

  useEffect(() => {
    if (isPath === true) {
      getallreportDataAsync(0, true);
      setPage(0);
    }
  }, [isPath]);

  if (data.length === 0) {
    return <NoContent text="Sem dados" />;
  }

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      <FlashList
        data={data}
        estimatedItemSize={300}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingRight: 16,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        keyExtractor={(item, i) => i + String(item.id)}
        ListFooterComponent={() => (
          <View
            style={{
              backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
            }}
          >
            {isloadingReportData ? (
              <ActivityIndicator />
            ) : page < totalPages ? (
              <View
                className="flex items-center justify-center mt-4"
                lightColor="transparent"
              >
                <TouchableOpacity
                  onPress={handleMoreData}
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

      {/* Botão Flutuante para Abrir Modal */}
      <TouchableOpacity
        onPress={() => setisOpenCreateReportModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={{
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
