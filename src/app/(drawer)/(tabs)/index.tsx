import { Clock3, Users2 } from 'lucide-react-native';

import Cards from '@/components/Cards';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { useReportsData } from '@/contexts/ReportContext';
import { StopWatch } from '@/components/StopWatch';
import { AnimatedButton } from '@/components/ui/ButtonAnimated';
import { Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AddReportModal } from '@/components/reports/add-report-modal';

interface IHoursAndMin {
  hours: number;
  minutes: number;
}

export default function TabOneScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { reports, setisOpenCreateReportModal } = useReportsData();

  function handleAddReport(data: IHoursAndMin | undefined) {
    setisOpenCreateReportModal(true);
    if (data) {
      router.setParams({ h: data.hours, m: data.minutes });
    }
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 50,
        }}
      >
        <View className="flex-1 pt-8 px-4" style={{ flex: 1 }}>
          <StopWatch onPress={handleAddReport} />
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white"
          >
            Relatório do mês atual{' '}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards
              Icon={Clock3}
              content={reports.time ? reports.time : '0'}
              title="Horas"
            />
            <Cards Icon={Users2} content={reports.students} title="ESTUDOS" />
          </View>
        </View>
      </ScrollView>
      <AnimatedButton onPress={() => handleAddReport(undefined)} />
      <AddReportModal />
    </>
  );
}
