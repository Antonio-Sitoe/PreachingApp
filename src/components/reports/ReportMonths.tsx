import '@/utils/localeConfig'
import { Calendar as CustomCalendar } from 'react-native-calendars'
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native'
import { Button, Flex } from '@react-native-material/core'
import { View, Text } from '../Themed'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { GET_ALL_REPORTS_TO_GLOBAL_STATES } from '@/database/actions/report/read'
import React, { useEffect, useState } from 'react'
import { ReportData } from '@/@types/interfaces'
import { useUser } from '@/contexts/UserContext'
import { defineProfiletext } from '@/utils/helper'
import { currentDates, monthNameToPortuguese } from '@/utils/dates'
import { initialReportData } from '@/utils/initialReportData'
import { useTabBarIndex, useReportsData } from '@/contexts/ReportContext'
import { usePathname } from 'expo-router'
import { DialogReport } from './components/DialogReport'

interface ValueProps {
  dateString?: string
  day?: number
  month: number
  timestamp?: number
  year: number
}

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

export default function ReportMonths() {
  const { colorScheme, isDark } = useTheme()
  const { user } = useUser()
  const { index } = useTabBarIndex()
  const [visible, setVisible] = useState(false)
  const { isOpenCreateReportModal, setTextToShare } = useReportsData()

  const [data, setData] = useState(initialReportData as ReportData)
  const [reports, setReports] = useState<ReportData[]>([])
  const [title, setTitle] = useState({
    month: monthNameToPortuguese(currentDates.month),
    year: currentDates.year,
  })
  const isFirstElement = index === 1
  const changePathname = usePathname() === '/report'
  const isModalClose = isOpenCreateReportModal === false

  const onMonthChange = async function (value: ValueProps) {
    const month = monthNameToPortuguese(value.month)
    const year = value.year
    setTitle({ month, year })
    const { data, reports } = await GET_ALL_REPORTS_TO_GLOBAL_STATES(
      month,
      year,
    )
    setData(data)
    setReports(reports)
  }

  useEffect(() => {
    onMonthChange({ month: currentDates.month, year: currentDates.year })
  }, [isFirstElement, changePathname, isModalClose])

  useEffect(() => {
    setTextToShare({
      user: user.name,
      data,
      day: {
        month: title.month,
        year: title.year,
      },
    })
  }, [data, setTextToShare, user.name, title])

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
            return <ChevronsLeft color={Colors[colorScheme].tint} size={30} />
          }
          return <ChevronsRight color={Colors[colorScheme].tint} size={30} />
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
          <ListItem title="Perfil" value={defineProfiletext(user.profile)} />
        </View>
        <Button
          variant="outlined"
          title="Editar Relatorio Mensal"
          color={Colors[colorScheme].text}
          titleStyle={{
            textTransform: 'capitalize',
            fontFamily: 'Inter_400Regular',
          }}
          onPress={() => setVisible(true)}
          style={{
            paddingVertical: 5,
            marginHorizontal: 5,
          }}
        />
      </Flex>
      {visible && (
        <DialogReport
          setVisible={setVisible}
          visible={visible}
          reports={reports}
        />
      )}
    </View>
  )
}
