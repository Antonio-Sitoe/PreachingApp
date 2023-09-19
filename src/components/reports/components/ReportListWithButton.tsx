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
import { GET_PARTIAL_REPORTDATA } from '@/database/actions/report/read'
import CardWithButton from './CardWithButton'

export type CardProps = ReportData[]

export default function ReportListWithButton() {
  const [data, setData] = useState<CardProps>([])
  const [isloadingReportData, setIsLoadingReportData] = useState(true)

  const { isDark } = useTheme()
  const changePathname = usePathname() === '/report'

  useEffect(() => {
    const getallreportDataAsync = async () => {
      setIsLoadingReportData(true)
      try {
        const { data } = await GET_PARTIAL_REPORTDATA()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if (changePathname) {
      getallreportDataAsync()
    }
    return () => {
      setIsLoadingReportData(true)
    }
  }, [changePathname])

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
        keyExtractor={(item, i) => i + String(item.id)}
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
        renderItem={({ item }) => <CardWithButton data={item} />}
      />
    </View>
  )
}
