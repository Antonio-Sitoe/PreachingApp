import '@/utils/localeConfig'
import { Calendar as CustomCalendar } from 'react-native-calendars'
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native'
import { Button, Flex } from '@react-native-material/core'
import { View, Text } from '../Themed'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { GET_ALL_REPORTS_TO_GLOBAL_STATES } from '@/database/actions/report/read'
import { useEffect, useState } from 'react'
import { ReportData } from '@/@types/interfaces'
import { useUser } from '@/contexts/UserContext'
import { defineProfiletext } from '@/utils/helper'
import { currentDates, monthNameToPortuguese } from '@/utils/dates'
import { initialReportData } from '@/utils/initialReportData'
interface ValueProps {
  dateString: string
  day: number
  month: number
  timestamp: number
  year: number
}

export default function ReportMonths() {
  const { colorScheme, isDark } = useTheme()
  const { user } = useUser()
  const [title, setTitle] = useState()
  const [data, setData] = useState(initialReportData as ReportData)

  async function onMonthChange(value: ValueProps) {
    const month = monthNameToPortuguese(value.month)
    const year = value.year
    const { data } = await GET_ALL_REPORTS_TO_GLOBAL_STATES(month, year)
    setData(data)
  }
  return (
    <View
      className="flex-1 relative"
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
    >
      <CustomCalendar
        renderArrow={(direction) => {
          if (direction === 'left') {
            return <ChevronsLeft color={Colors[colorScheme].tint} size={30} />
          }
          return <ChevronsRight color={Colors[colorScheme].tint} size={30} />
        }}
        headerStyle={{
          height: 'auto',
          width: 'auto',
        }}
        hideDayNames
        dayComponent={() => null}
        tvParallaxShiftDistanceY={60}
        onMonthChange={onMonthChange}
        theme={{
          textDayHeaderFontFamily: 'IBMPLEX_Regular',
          textDayHeaderFontSize: 10,
          textMonthFontFamily: 'IBMPLEX_Regular',
          textMonthFontSize: 18,
        }}
      />
      <Flex mt={-75} bg={isDark ? Colors.dark.background : '#F6F6F9'}>
        <View className="grid grid-cols-1 divide-y divide-slate-300">
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Total de Horas</Text>
            <Text className="text-base font-text">{data?.time}</Text>
          </View>
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Publicacoes</Text>
            <Text className="text-base font-text">{data?.publications}</Text>
          </View>
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Videos Mostrados</Text>
            <Text className="text-base font-text">{data?.videos}</Text>
          </View>
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Revisitas</Text>
            <Text className="text-base font-text">{data?.returnVisits}</Text>
          </View>
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Estudos</Text>
            <Text className="text-base font-text">{data?.students}</Text>
          </View>
          <View className="flex-row justify-between px-4 py-3">
            <Text className="text-base font-text">Perfil</Text>
            <Text className="text-base font-text">
              {defineProfiletext(user.profile)}
            </Text>
          </View>
        </View>
      </Flex>
      <Button
        variant="outlined"
        title="Editar Relatorio Mensal"
        color={Colors[colorScheme].tint}
        style={{
          paddingVertical: 5,
        }}
      />
    </View>
  )
}
