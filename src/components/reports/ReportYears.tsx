import '@/utils/localeConfig'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { Flex } from '@react-native-material/core'
import { View, Text } from '../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { currentDates } from '@/utils/dates'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { initialReportData } from '@/utils/initialReportData'
import { useEffect, useState } from 'react'
import { GET_REPORTS_BY_YEARS } from '@/database/actions/report/read'
import { Calendar as CustomCalendar } from 'react-native-calendars'
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native'
import { useTabBarIndex, useReportsData } from '@/contexts/ReportContext'

const ListItem = ({ title, value, ...props }) => {
  return (
    <View
      lightColor="#F6F6F9"
      className="flex-row justify-between px-4 py-3"
      {...props}
    >
      <Text className="text-base font-text">{title}</Text>
      <Text className="text-base font-text">{value}</Text>
    </View>
  )
}

export default function ReportYears() {
  const { colorScheme, isDark } = useTheme()
  const { index } = useTabBarIndex()
  const { isOpenCreateReportModal } = useReportsData()

  const [data, setData] = useState(initialReportData as ReportData)
  const [year, setYear] = useState(currentDates.year)

  const isFirstElement = index === 1
  const changePathname = usePathname() === '/report'
  const isModalClose = isOpenCreateReportModal === false

  function handleGotoNextYear() {
    setYear((year) => year + 1)
  }
  function handleGoBack() {
    setYear((year) => year - 1)
  }
  async function onChangeYear({ year }) {
    const { data } = await GET_REPORTS_BY_YEARS(year)
    setData(data)
  }

  useEffect(() => {
    onChangeYear({ year })
  }, [isFirstElement, changePathname, isModalClose, year])

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
              <TouchableOpacity
                onPress={handleGoBack}
                activeOpacity={0.7}
                className="w-11 h-8"
              >
                <ChevronsLeft color={Colors[colorScheme].tint} size={30} />
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity
              onPress={handleGotoNextYear}
              activeOpacity={0.7}
              className="w-11 h-8"
            >
              <ChevronsRight color={Colors[colorScheme].tint} size={30} />
            </TouchableOpacity>
          )
        }}
        headerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        }}
        customHeaderTitle={
          <Text className="capitalize text-base font-subTitle">{year}</Text>
        }
        dayComponent={() => null}
      />
      <Flex
        bg={isDark ? Colors.dark.background : '#F6F6F9'}
        style={{ position: 'absolute', top: 60, width: '100%' }}
      >
        <View className="grid grid-cols-1 divide-y divide-slate-300">
          <ListItem title="Total de Horas" value={data?.time} />
          <ListItem title="Publicacoes" value={data?.publications} />
          <ListItem title="Videos Mostrados" value={data?.videos} />
          <ListItem title="Revisitas" value={data?.returnVisits} />
          <ListItem title="Estudos" value={data?.students} />
        </View>
      </Flex>
    </View>
  )
}
