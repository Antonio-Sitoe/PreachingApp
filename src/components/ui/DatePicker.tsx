import { IconIOS } from '@/assets/icons/Icon';
import TouchableOpacity, { Text } from '@/components/Themed';
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import dayjs from 'dayjs';
import Colors from '@/constants/Colors';
import type { Dispatch, SetStateAction } from 'react';
import useTheme from '@/hooks/useTheme';

function formateDate(date: Date) {
  return dayjs(date).format('DD [de] MMMM [de] YYYY');
}
interface DatePickerProps {
  date: string | Date;
  setDate: Dispatch<SetStateAction<Date>>;
}
export function DatePicker({ date, setDate }: DatePickerProps) {
  const { isDark } = useTheme();
  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
    }
  };

  const showMode = (currentMode: 'date') => {
    DateTimePickerAndroid.open({
      value: dayjs(date).toDate(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={showDatepicker}
      className="mt-[10px] mb-[10px] h-10 w-auto flex-row items-center rounded-lg px-2.5 gap-[10px]"
      style={{
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      }}
    >
      <IconIOS
        name="calendar-outline"
        size={20}
        color={Colors.light.ligtInputbG}
      />
      <Text
        className="text-base text-white font-textIBM"
        lightColor="white"
        darkColor="white"
      >
        {formateDate(new Date(date))}
      </Text>
    </TouchableOpacity>
  );
}
