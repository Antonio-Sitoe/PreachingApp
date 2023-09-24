import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import NoContent from '../../NoContent'
import CardWithButton from './CardWithButton'

import { FlashList } from '@shopify/flash-list'
import { Button } from '@react-native-material/core'
import { Text, View } from '../../Themed'
import { ReportData } from '@/@types/interfaces'
import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { GET_PARTIAL_REPORTDATA } from '@/database/actions/report/read'
import { usePathname } from 'expo-router'

export type CardProps = ReportData[]

export default function ReportListWithButton() {
  const [data, setData] = useState<CardProps>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPage] = useState(0)
  const [isloadingReportData, setIsLoadingReportData] = useState(true)
  const isPath = usePathname() === '/report'
  console.log('TOTAL DE ITEMS', data.length)

  const { isDark } = useTheme()

  async function handleMoreData() {
    if (page < totalPages) {
      const newPage = page + 1
      setPage(newPage)
      await getallreportDataAsync(newPage, false)
    }
  }

  const getallreportDataAsync = async (page: number, isInitial = false) => {
    setIsLoadingReportData(true)
    try {
      const limit = 10
      const { data, totalPage } = await GET_PARTIAL_REPORTDATA(page, limit)
      if (page < totalPage) {
        if (isInitial) {
          setData(data)
        } else {
          setData((prev) => [...prev, ...data])
        }
      }
      setTotalPage(totalPage)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingReportData(false)
    }
  }

  useEffect(() => {
    if (isPath === true) {
      getallreportDataAsync(0, true)
      setPage(0)
    }
  }, [isPath])

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
                {page < totalPages ? (
                  <View
                    className="flex items-center justify-center mt-4"
                    lightColor="transparent"
                  >
                    <Button
                      title="Ver mais"
                      onPress={handleMoreData}
                      variant="contained"
                      color={isDark ? Colors.dark.tint : Colors.light.tint}
                      className="font-text capitalize text-white"
                      style={{ width: 150 }}
                      titleStyle={{
                        color: isDark ? Colors.dark.Success200 : 'white',
                        fontFamily: 'Inter_400Regular',
                        textTransform: 'capitalize',
                      }}
                    />
                  </View>
                ) : (
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
        renderItem={({ item }) => <CardWithButton data={item} />}
      />
    </View>
  )
}
