import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import React, { useEffect, useState } from 'react'

import { FlatList, ActivityIndicator } from 'react-native'
import { READ_ALL_REPORT_DATA } from '@/database/actions/report/read'
import { useTabBarIndex } from '@/contexts/ReportContext'
import { usePathname } from 'expo-router'
import { Card } from './Card'
import { View } from '../Themed'

export interface Reports {
  date: string
  id: string
  text: string
}

export interface ReportDataProps {
  id: string
  name: string
  year: string
  totalText: string
  reports: Reports[]
}
export type CardProps = ReportDataProps[]

export default function ReportsList() {
  const [data, setData] = useState<CardProps>([])
  const [isloadingReportData, setIsLoadingReportData] = useState(false)

  const { isDark } = useTheme()
  const { index } = useTabBarIndex()

  const isFirstElement = index === 0
  const changePathname = usePathname()

  useEffect(() => {
    const getallreportDataAsync = async () => {
      setIsLoadingReportData(true)
      try {
        const data = await READ_ALL_REPORT_DATA()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    getallreportDataAsync()
  }, [isFirstElement, changePathname])

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1 bg-slate-300"
    >
      {isloadingReportData ? (
        <ActivityIndicator className="mt-5 text-dark-tint" />
      ) : (
        <FlatList
          className="mt-3 py-4 px-4"
          data={data}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => <Card data={item} />}
          keyExtractor={(item) => item.id}
          style={{ paddingBottom: 80 }}
        />
      )}
    </View>
  )
}
