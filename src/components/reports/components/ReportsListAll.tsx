import Card from './Card'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import NoContent from '../../NoContent'

import { FlashList } from '@shopify/flash-list'
import { Text, View } from '../../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { useTabBarIndex } from '@/contexts/ReportContext'
import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { GET_ALL_REPORT_DATA } from '@/database/actions/report/read'

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

export default function ReportsListAll() {
  const [data, setData] = useState<CardProps>([])
  const [isloadingReportData, setIsLoadingReportData] = useState(true)

  const { isDark } = useTheme()
  const { index } = useTabBarIndex()

  const isFirstElement = index === 0
  const changePathname = usePathname() === '/report'
  const isEnableToRender = isFirstElement && changePathname

  useEffect(() => {
    const getallreportDataAsync = async () => {
      setIsLoadingReportData(true)
      try {
        const { data } = await GET_ALL_REPORT_DATA()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if (isEnableToRender) {
      getallreportDataAsync()
    }
    return () => {
      setIsLoadingReportData(true)
    }
  }, [isEnableToRender])

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
                <Text
                  className="mt-2 font-textIBM text-center"
                  lightColor={Colors.light.tint}
                >
                  Sem mais dados por mostrar 😎
                </Text>
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
