import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { Pen } from 'lucide-react-native';
import TouchableOpacity, { View, Text } from '@/components/Themed';
import { memo } from 'react';
import { capitalizeString } from '@/utils/helper';
import { useReportsData } from '@/contexts/ReportContext';
import dayjs from 'dayjs';

function CardWithButton({ data }) {
  const { isDark } = useTheme();

  const date = dayjs(data.date)
    .locale('pt-br')
    .format('dddd, D [de] MMMM [de] YYYY');

  return (
    <View className="w-full mb-4" lightColor="transparent">
      <View className="flex flex-row gap-2" lightColor="transparent">
        <View
          lightColor="#c1e9e2"
          darkColor={Colors.dark.darkBgSecundary}
          className="p-2 pb-4 flex-1 rounded-lg shadow-lg"
        >
          <Text
            style={{
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              color: 'white',
            }}
            darkColor="black"
            className="p-1 px-2 mb-1 rounded-lg font-bold"
          >
            {capitalizeString(date)}
          </Text>
          <Text lightColor="#504F4F" className="text-sm pl-2 font-subTitle">
            {`${data.hours >= 10 ? data.hours : `0${data.hours}`}:${
              data.minutes >= 10 ? data.minutes : `0${data.minutes}`
            } horas, ${data.students} estudantes`}
          </Text>
        </View>
        <View className="w-[56px] flex flex-col">
          <TouchableOpacity
            onPress={() => {
              const state = useReportsData.getState();
              state.set({
                reports: data,
                isOpenCreateReportModal: true,
              });
            }}
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            className="w-full h-full rounded-lg flex items-center justify-center dark:bg-black"
          >
            <Pen color="white" size={20} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default memo(CardWithButton);
