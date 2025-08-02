import TouchableOpacity, { View, Text } from '@/components/Themed';
import type { IReport } from '@/database/schemas';
import { calculeTotalNumbers } from '@/utils/calculeTotalNumbers';

import Colors from '@/constants/Colors';
import React from 'react';
import { useReportsData } from '@/contexts/ReportContext';
import dayjs from 'dayjs';
import { monthNameToPortuguese } from '@/utils/dates';

const Card = ({
  data,
  year,
  isDark,
}: {
  data: Array<[string, IReport[]]>;
  year: string;
  isDark: boolean;
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data.map((report, index) => {
    const monthName = report[0] as unknown as number;
    const listOfReports = report[1] as IReport[];

    if (
      !listOfReports ||
      !Array.isArray(listOfReports) ||
      listOfReports.length === 0
    ) {
      return null;
    }

    const { data } = calculeTotalNumbers(report[1]);
    return (
      <View
        lightColor="#c1e9e2"
        darkColor={Colors.dark.darkBgSecundary}
        className="bg-[] p-2 mb-4 rounded-lg"
        key={index.toString()}
      >
        <View
          style={{
            backgroundColor: isDark
              ? Colors.dark.Success200
              : Colors.light.tint,
          }}
          className="w-3 h-3 bg-indigo-500 rounded-full"
        />
        <View
          lightColor="#c1e9e2"
          darkColor={Colors.dark.darkBgSecundary}
          className="pl-5 pb-5 pr-2"
        >
          <View
            lightColor="#c1e9e2"
            darkColor={Colors.dark.darkBgSecundary}
            className="flex-row mb-1 gap-1 items-center"
          >
            <Text
              lightColor=""
              darkColor="#c1e9e2"
              className="font-title text-base capitalize"
            >
              {monthNameToPortuguese(monthName)}
            </Text>
            <Text lightColor="" darkColor="#c1e9e2" className="text-sm">
              ({year})
            </Text>
          </View>
          <Text lightColor="#504F4F" className="text-sm font-subTitle">
            {`${data?.time || '0:00'} horas, ${data?.students || 0} estudantes`}
          </Text>
          {listOfReports.map((item, index) => {
            if (!item || !item.date) {
              return null;
            }
            const date = dayjs(item.date)
              .locale('pt-br')
              .format('dddd, D [de] MMMM [de] YYYY');
            return (
              <TouchableOpacity
                key={`${item.id} ${index}`}
                className="mt-3"
                style={{
                  backgroundColor: 'transparent',
                }}
                onPress={() => {
                  const state = useReportsData.getState();
                  state.set({
                    reports: item,
                    isOpenCreateReportModal: true,
                  });
                }}
              >
                <Text
                  style={{
                    backgroundColor: isDark
                      ? Colors.dark.tint
                      : Colors.light.tint,
                    color: 'white',
                  }}
                  darkColor="black"
                  className="p-1 px-2 mb-1 rounded-lg"
                >
                  {date}
                </Text>
                <Text className="ml-2" lightColor="#504F4F" darkColor="#c1e9e2">
                  {`${
                    (item.hours || 0) >= 10
                      ? item.hours || 0
                      : `0${item.hours || 0}`
                  }:${
                    (item.minutes || 0) >= 10
                      ? item.minutes || 0
                      : `0${item.minutes || 0}`
                  } horas`}
                  , {item.students} estudantes
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  });
};

export default React.memo(Card);
