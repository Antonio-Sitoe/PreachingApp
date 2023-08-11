import Card from './Card'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import NoContent from '../NoContent'

import React, { useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { Text, View } from '../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { GET_ALL_REPORT_DATA } from '@/database/actions/report/read'
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext'

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
        const { data, count } = await GET_ALL_REPORT_DATA(take)
        setData(data)
        setTotalOfRecords(count)
        console.log('total of reports', count)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if (isFirstElement && changePathname) {
      getallreportDataAsync(take)
    } else if (isModalClose) {
      getallreportDataAsync(take)
    }
    console.log('number to take', take)
    return () => {
      setIsLoadingReportData(true)
    }
  }, [isFirstElement, changePathname, isModalClose, take])

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
              <>
                {take > totalOfRecords && (
                  <Text
                    className="mt-2 font-textIBM text-center"
                    lightColor={Colors.light.tint}
                  >
                    Sem mais dados por mostrar 😎
                  </Text>
                )}
              </>
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
