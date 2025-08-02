import '@/utils/localeConfig';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { View, Text } from '../Themed';
import { currentDates } from '@/utils/dates';
import { TouchableOpacity } from 'react-native';
import { initialReportData } from '@/utils/initialReportData';
import { useEffect, useState, useCallback } from 'react';
import { type IReport, reportsActions } from '@/database/actions';
import { Calendar as CustomCalendar } from 'react-native-calendars';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext';
import { AnimatedButton } from '../ui/ButtonAnimated';

const ListItem = ({ title, value, ...props }) => {
  return (
    <View
      lightColor="white"
      className="flex-row justify-between px-4 py-3"
      {...props}
    >
      <Text className="text-base font-text">{title}</Text>
      <Text className="text-base font-text">{value}</Text>
    </View>
  );
};

interface IReportData extends IReport {
  time: string;
}

export default function ReportYears() {
  const { isDark } = useTheme();
  const { index } = useTabBarIndex();
  const _isYears = index === 2;
  const { setisOpenCreateReportModal } = useReportsData();
  const [data, setData] = useState(initialReportData as IReportData);
  const [year, setYear] = useState(currentDates.year);

  function handleGotoNextYear() {
    setYear((year) => year + 1);
  }
  function handleGoBack() {
    setYear((year) => year - 1);
  }
  const onChangeYear = useCallback(async ({ year }) => {
    const { data } = await reportsActions.getByYear(year);
    setData(data as unknown as IReportData);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial render
  useEffect(() => {
    if (_isYears) {
      onChangeYear({ year });
    }
  }, [_isYears]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? Colors.dark.background : 'white',
        position: 'relative',
      }}
    >
      <CustomCalendar
        renderArrow={(direction) => {
          if (direction === 'left') {
            return (
              <TouchableOpacity
                onPress={handleGoBack}
                activeOpacity={0.7}
                className="w-11 h-8"
              >
                <ChevronsLeft
                  color={isDark ? Colors.dark.tint : Colors.light.tint}
                  size={30}
                />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              onPress={handleGotoNextYear}
              activeOpacity={0.7}
              className="w-11 h-8"
            >
              <ChevronsRight
                color={isDark ? Colors.dark.tint : Colors.light.tint}
                size={30}
              />
            </TouchableOpacity>
          );
        }}
        customHeaderTitle={
          <Text className="capitalize text-base font-subTitle">{year}</Text>
        }
        hideDayNames
        style={{
          height: 60,
          paddingTop: 3,
        }}
        headerStyle={{
          backgroundColor: isDark ? Colors.dark.background : 'white',
        }}
        dayComponent={() => null}
      />

      <View
        className="grid flex-1 grid-cols-1 divide-y divide-slate-300"
        lightColor="white"
      >
        <ListItem title="Total de Horas" value={data?.time} />
        <ListItem title="Estudos" value={data?.students} />
      </View>
      <AnimatedButton onPress={() => setisOpenCreateReportModal(true)} />
    </View>
  );
}
