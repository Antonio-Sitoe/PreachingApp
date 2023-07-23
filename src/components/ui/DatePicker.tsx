import { IconIOS } from '@/assets/icons/Icon'
import { Text } from 'react-native'
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

import { TouchableOpacity } from 'react-native-gesture-handler'

import dayjs from 'dayjs'
import Colors from '@/constants/Colors'
import { Dispatch, SetStateAction } from 'react'

function formateDate(date: Date) {
  return dayjs(date).format('DD [de] MMMM [de] YYYY')
}
interface DatePickerProps {
  date: string | Date
  setDate: Dispatch<SetStateAction<Date>>
}
export function DatePicker({ date, setDate }: DatePickerProps) {
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    if (selectedDate) {
      const currentDate = selectedDate
      setDate(currentDate)
    }
  }

  const showMode = (currentMode: 'date') => {
    DateTimePickerAndroid.open({
      value: dayjs(date).toDate(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    })
  }

  const showDatepicker = () => {
    showMode('date')
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={showDatepicker}
      style={{
        marginBottom: 13,
        height: 47,
        width: 'auto',
        backgroundColor: Colors.light.tint,
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
      <Text className="text-base text-white font-textIBM">
        {formateDate(new Date(date))}
      </Text>
    </TouchableOpacity>
  )
}
