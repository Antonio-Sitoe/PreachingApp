import '@/utils/localeConfig';
import { Calendar as CustomCalendar } from 'react-native-calendars';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { reportsActions } from '@/database/actions';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { currentDates, monthNameToPortuguese } from '@/utils/dates';
import { initialReportData } from '@/utils/initialReportData';
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext';
import { View, Text } from '../Themed';
import type { IReport } from '@/database/schemas';
import { AnimatedButton } from '../ui/ButtonAnimated';

interface ValueProps {
  dateString?: string;
  day?: number;
  month: number;
  timestamp?: number;
  year: number;
}

export const ListItem = ({ title, value, ...props }) => {
  return (
    <View
      lightColor="#F6F6F9"
      className="flex-row justify-between px-4 py-3"
      {...props}
    >
      <Text className="text-base font-text">{title}</Text>
      <Text className="text-base font-text">{value}</Text>
    </View>
  );
};

interface IReportData extends IReport {
  isParticipated: boolean;
  time: string;
}

export default function ReportMonths() {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { index } = useTabBarIndex();
  const _isMonths = index === 1;
  const { setTextToShare, setisOpenCreateReportModal } = useReportsData();

  const [data, setData] = useState(initialReportData as unknown as IReportData);
  const [title, setTitle] = useState({
    month: monthNameToPortuguese(currentDates.month),
    year: currentDates.year,
  });

  const onMonthChange = async (value: ValueProps) => {
    const monthName = monthNameToPortuguese(value.month);
    const year = value.year;
    setTitle({ month: monthName, year });
    const { data } = await reportsActions.getGlobalStates({
      month: monthName,
      year,
    });
    setData(data as unknown as IReportData);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial render
  useEffect(() => {
    if (_isMonths) {
      onMonthChange({ month: currentDates.month, year: currentDates.year });
    }
  }, [_isMonths]);

  useEffect(() => {
    if (user?.username) {
      setTextToShare({
        user: user.username,
        data: data as unknown as IReport,
        day: {
          month: title.month,
          year: title.year,
        },
      });
    }
  }, [user?.username, data, title.month, title.year, setTextToShare]);

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
              <ChevronsLeft
                color={isDark ? Colors.dark.tint : Colors.light.tint}
                size={30}
              />
            );
          }
          return (
            <ChevronsRight
              color={isDark ? Colors.dark.tint : Colors.light.tint}
              size={30}
            />
          );
        }}
        headerStyle={{
          backgroundColor: isDark ? Colors.dark.background : 'white',
        }}
        style={{
          height: 60,
          paddingTop: 2,
        }}
        customHeaderTitle={
          <Text className="capitalize text-base font-subTitle">
            {title.month}, {title.year}
          </Text>
        }
        dayComponent={() => null}
        onMonthChange={onMonthChange}
        hideDayNames
      />
      <View className="flex-col flex-1 justify-between pb-4">
        <View className="grid grid-cols-1 divide-y divide-slate-300">
          <ListItem
            title="Participou no ministério"
            value={data?.isParticipated ? 'Sim' : 'Não'}
          />
          <ListItem title="Total de Horas" value={data?.time} />
          <ListItem title="Estudos" value={data?.students} />
          <ListItem title="Perfil" value={user?.profile} />
        </View>
      </View>
      <AnimatedButton onPress={() => setisOpenCreateReportModal(true)} />
    </View>
  );
}
