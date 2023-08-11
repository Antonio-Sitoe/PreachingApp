import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import React, { useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import Card from './Card'
import { Text, View } from '../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext'
import {
  GET_ALL_REPORT_DATA,
  GET_THE_TOTAL_NUMBER_OF_RECORDS,
} from '@/database/actions/report/read'
import { ActivityIndicator, FlatList } from 'react-native'
import NoContent from '../NoContent'
import { take } from '@nozbe/watermelondb/QueryDescription'

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
  const [take, setTake] = useState(10)
  const [data, setData] = useState<CardProps>([])
  const [isloadingReportData, setIsLoadingReportData] = useState(true)
  const [totalOfRecords, setTotalOfRecords] = useState(0)

  const { isDark } = useTheme()
  const { index } = useTabBarIndex()
  const { isOpenCreateReportModal } = useReportsData()

  const isFirstElement = index === 0
  const changePathname = usePathname() === '/report'
  const isModalClose = isOpenCreateReportModal === false

  function handleGotoNextPage() {
    if (isloadingReportData === false && take < totalOfRecords) {
      setTake(take + 10)
    }
  }

  useEffect(() => {
    const getallreportDataAsync = async (take: number) => {
      setIsLoadingReportData(true)
      try {
        const data = await GET_ALL_REPORT_DATA(take)
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if ((isFirstElement && changePathname) || isModalClose) {
      getallreportDataAsync(take)
    }
    return () => {
      setIsLoadingReportData(true)
    }
  }, [isFirstElement, changePathname, isModalClose, take])

  useEffect(() => {
    async function getTotalNumberOfRecords() {
      const { count } = await GET_THE_TOTAL_NUMBER_OF_RECORDS()
      console.log('total de records', count)
      setTotalOfRecords(count)
    }
    getTotalNumberOfRecords()
    return () => {
      setTake(10) // reseting the
    }
  }, [])

  if (data.length === 0) {
    return <NoContent text="Sem dados" />
  }

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      <FlashList
        data={data}
        estimatedItemSize={300}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.3}
        onEndReached={handleGotoNextPage}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingRight: 16,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        keyExtractor={(item, i) => item.year + i}
        ListFooterComponent={() => (
          <View
            style={{
              backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
            }}
          >
            {isloadingReportData ? (
              <ActivityIndicator />
            ) : (
              <Text
                darkColor="#c1e9e2"
                className="font-text text-base text-center mt-3"
              >
                Sem dados por mostrar
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <Card isDark={isDark} data={item.reports} year={item.year} />
        )}
      />
    </View>
  )
}
