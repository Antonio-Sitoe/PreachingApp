import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import React, { useEffect, useState } from 'react'

import { Card } from './Card'
import { View } from '../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { useTabBarIndex } from '@/contexts/ReportContext'
import { GET_ALL_REPORT_DATA } from '@/database/actions/report/read'
import { FlatList, ActivityIndicator } from 'react-native'

export interface Reports {
  date: string
  id: string
  text: string
}

export interface ReportDataProps {
  year: string
  reports: Array<[string, ReportData[]]>
}
export type CardProps = ReportDataProps[]

export default function ReportsList() {
  const [data, setData] = useState<CardProps>([])
  const [isloadingReportData, setIsLoadingReportData] = useState(true)

  const { isDark } = useTheme()
  const { index } = useTabBarIndex()

  const isFirstElement = index === 0
  const changePathname = usePathname() === '/report'

  useEffect(() => {
    const getallreportDataAsync = async () => {
      setIsLoadingReportData(true)
      try {
        const data = await GET_ALL_REPORT_DATA()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if (isFirstElement && changePathname) {
      getallreportDataAsync()
    }

    return () => {
      setIsLoadingReportData(true)
    }
  }, [isFirstElement, changePathname])

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      {isloadingReportData ? (
        <ActivityIndicator className="mt-5 text-dark-tint" />
      ) : (
        <FlatList
          className="mt-3 py-4 px-4"
          data={data}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <Card data={item.reports} year={item.year} />
          )}
          keyExtractor={(item, i) => item.year + i}
          style={{ paddingBottom: 80 }}
        />
      )}
    </View>
  )
}
