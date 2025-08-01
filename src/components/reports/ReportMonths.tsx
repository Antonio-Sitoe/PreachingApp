import '@/utils/localeConfig';
import { Calendar as CustomCalendar } from 'react-native-calendars';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { type IReport, reportsActions } from '@/database/actions';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { defineProfiletext } from '@/utils/helper';
import { currentDates, monthNameToPortuguese } from '@/utils/dates';
import { initialReportData } from '@/utils/initialReportData';
import { useTabBarIndex, useReportsData } from '@/contexts/ReportContext';
import { usePathname } from 'expo-router';
import { DialogReport } from './components/DialogReport';
import { View } from '../Themed';

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

export default function ReportMonths() {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { index } = useTabBarIndex();
  const [visible, setVisible] = useState(false);
  const { isOpenCreateReportModal, setTextToShare } = useReportsData();

  const [data, setData] = useState(initialReportData as IReport);
  const [reports, setReports] = useState<IReport[]>([]);
  const [title, setTitle] = useState({
    month: monthNameToPortuguese(currentDates.month),
    year: currentDates.year,
  });
  const _isFirstElement = index === 1;
  const _changePathname = usePathname() === '/report';
  const _isModalClose = isOpenCreateReportModal === false;

  const onMonthChange = async (value: ValueProps) => {
    const month = monthNameToPortuguese(value.month);
    const year = value.year;
    setTitle({ month, year });
    const { data, reports } = await reportsActions.getGlobalStates({
      month,
      year,
    });
    setData(data as IReport);
    setReports(reports as IReport[]);
  };

  useEffect(() => {
    onMonthChange({ month: currentDates.month, year: currentDates.year });
  }, []);

  useEffect(() => {
    if (user?.name) {
      setTextToShare({
        user: user.name,
        data,
        day: {
          month: title.month,
          year: title.year,
        },
      });
    }
  }, []);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
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
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        }}
        customHeaderTitle={
          <Text className="capitalize text-base font-subTitle">
            {title.month}, {title.year}
          </Text>
        }
        dayComponent={() => null}
        onMonthChange={onMonthChange}
      />
      <View className="flex-col flex-1 justify-between pb-4">
        <View className="grid grid-cols-1 divide-y bdivide-slate-300">
          <ListItem title="Total de Horas" value={data?.time} />
          <ListItem title="Estudos" value={data?.students} />
          <ListItem title="Perfil" value={defineProfiletext(user?.profile)} />
        </View>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{
            paddingVertical: 12,
            marginHorizontal: 5,
            borderWidth: 1,
            borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Text
            style={{
              color: isDark ? Colors.dark.text : Colors.light.text,
              textTransform: 'capitalize',
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
            }}
          >
            Editar Relatório Mensal
          </Text>
        </TouchableOpacity>
      </View>
      {visible && (
        <DialogReport
          setVisible={setVisible}
          visible={visible}
          reports={reports}
        />
      )}
    </View>
  );
}
