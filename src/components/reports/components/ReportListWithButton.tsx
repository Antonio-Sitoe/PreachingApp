import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import NoContent from '../../NoContent'
import CardWithButton from './CardWithButton'

import { FlashList } from '@shopify/flash-list'
import { Button } from '@react-native-material/core'
import { Text, View } from '../../Themed'
import { ReportData } from '@/@types/interfaces'
import { usePathname } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { GET_PARTIAL_REPORTDATA } from '@/database/actions/report/read'

export type CardProps = ReportData[]

export default function ReportListWithButton() {
  const [data, setData] = useState<CardProps>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPage] = useState(0)
  const [isloadingReportData, setIsLoadingReportData] = useState(true)

  const { isDark } = useTheme()
  const changePathname = usePathname() === '/report'

  function handleMoreData() {
    if (page <= totalPages) {
      setPage(page + 1)
    }
  }

  useEffect(() => {
    const getallreportDataAsync = async (page: number) => {
      setIsLoadingReportData(true)
      try {
        const limit = 4
        const { data, totalPage } = await GET_PARTIAL_REPORTDATA(page, limit)
        setData(data)
        setTotalPage(totalPage)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingReportData(false)
      }
    }
    if (changePathname) {
      getallreportDataAsync(page)
    }
    return () => {
      setIsLoadingReportData(true)
    }
  }, [changePathname, page])

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
                <Button title="Ver mais" onPress={handleMoreData} />
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
