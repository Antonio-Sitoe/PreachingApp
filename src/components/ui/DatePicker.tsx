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
      style={{
        marginTop: 13,
        marginBottom: 13,
        height: 47,
        width: 'auto',
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 8,
      }}
    >
      <IconIOS
        name="calendar-outline"
        size={28}
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
