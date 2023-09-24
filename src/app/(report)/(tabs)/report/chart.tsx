import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import React, { useEffect, useState } from 'react'
import RNPickerSelect from 'react-native-picker-select'
import { Text } from '@/components/Themed'
import { Picker } from '@react-native-picker/picker'
import { ListItem } from '@/components/reports/ReportMonths'
import { useRouter } from 'expo-router'

import { ReportData } from '@/@types/interfaces'
import { ChevronLeft } from 'lucide-react-native'
import { currentDates } from '@/utils/dates'
import { Dimensions, View } from 'react-native'
import { best, bestMonthsStatics, capitalizeString } from '@/utils/helper'
import { GET_REPORT_FOR_STATICS } from '@/database/actions/report/read'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator } from '@react-native-material/core'

import { LineChart } from 'react-native-chart-kit'

interface IChartData {
  month: string
  reports: ReportData
}

interface Ibest {
  hours: {
    value: number
    month: string
  }
  publications: {
    value: number
    month: string
  }
  returnVisits: {
    value: number
    month: string
  }
  students: {
    value: number
    month: string
  }
  videos: {
    value: number
    month: string
  }
}

export default function Chart() {
  const { back } = useRouter()
  const { isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [select, setSelect] = useState('hours')
  const [data, setData] = useState<IChartData[]>([])
  const [bestMonthData, setBestMonthData] = useState(best as Ibest)
  const [reportValues, setReportValues] = useState<number[]>([])
  const screenWidth = Dimensions.get('window').width - 24
  const Chartdata = {
    labels:
      data.length > 0
        ? data.map((item) => capitalizeString(item.month))
        : [capitalizeString(currentDates.month)],
    datasets: [
      {
        data: reportValues.length > 0 ? reportValues : [0],
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: isDark ? Colors.dark.tint : Colors.light.tint,
    backgroundGradientTo: isDark ? Colors.dark.tint : Colors.light.tint,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => '#ffffff',
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffffff',
    },
  }
  const graphStyle = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    borderRadius: 16,
    boxShadow: 5,
  }
  function handleChangeSelectData(value: string) {
    setSelect(value)
    switch (value) {
      case 'hours': {
        const reportVa = data.map((item) => {
          const [h, _] = String(item.reports.time).split(':')
          return Number(h)
        })
        setReportValues(reportVa)
        break
      }
      case 'videos':
        setReportValues(data.map((item) => item.reports.videos))
        break
      case 'publications':
        setReportValues(data.map((item) => item.reports.publications))
        break
      case 'returnVisits':
        setReportValues(data.map((item) => item.reports.returnVisits))
        break

      default:
        setReportValues(data.map((item) => item.reports.students))
        break
    }
  }

  useEffect(() => {
    async function getReportForStats() {
      try {
        const { data } = await GET_REPORT_FOR_STATICS(currentDates.year)
        if (data.length) {
          const reportVa = data.map((item) => {
            const [h, _] = String(item.reports.time).split(':')
            return Number(h)
          })
          setReportValues(reportVa)
          setData(data)
          setBestMonthData(bestMonthsStatics(data))
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getReportForStats()
  }, [])

  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland']

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      <ScrollView>
        <View className="pt-4 px-4">
          <View className="flex-row justify-between items-center w-full">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-10 h-10 items-center justify-center"
                onPress={back}
              >
                <ChevronLeft
                  size={45}
                  color={isDark ? Colors.dark.tint : Colors.light.tint}
                />
              </TouchableOpacity>
              <Text className="text-base" lightColor="" darkColor="white">
                Voltar
              </Text>
            </View>
            <View className="w-40 p-0 border-gray-200 border-b-[1px]">
              <Picker
                selectedValue={select}
                onValueChange={handleChangeSelectData}
                style={{
                  color: isDark ? 'white' : Colors.dark.background,
                  padding: 0,
                  margin: 0,
                }}
              >
                <Picker.Item label="Horas" value="hours" />
                <Picker.Item label="Videos" value="videos" />
                <Picker.Item label="Publicacoes" value="publications" />
                <Picker.Item label="Revisitas" value="returnVisits" />
                <Picker.Item label="Estudos" value="students" />
              </Picker>
            </View>
          </View>
          <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
            ]}
          />
        </View>
        <View className="w-full pt-5 items-center justify-center">
          {isLoading ? (
            <View className="bg-slate-300 w-full h-[256px] flex items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <LineChart
              data={Chartdata}
              width={screenWidth}
              chartConfig={chartConfig}
              style={graphStyle as any}
              height={256}
              bezier
            />
          )}
          <View className="w-full mt-2">
            <Text className="text-lg font-bold px-4 font-text">
              Melhores Meses
            </Text>
            <View className="grid grid-cols-1 divide-y divide-slate-300">
              <ListItem
                title="Total de Horas"
                value={`${bestMonthData?.hours?.value} (${capitalizeString(
                  bestMonthData?.hours?.month,
                )})`}
              />
              <ListItem
                title="Publicacoes"
                value={`${bestMonthData?.publications
                  ?.value} (${capitalizeString(
                  bestMonthData?.publications?.month,
                )})`}
              />
              <ListItem
                title="Videos Mostrados"
                value={`${bestMonthData?.videos?.value} (${capitalizeString(
                  bestMonthData?.videos?.month,
                )})`}
              />
              <ListItem
                title="Revisitas"
                value={`${bestMonthData?.returnVisits
                  ?.value} (${capitalizeString(
                  bestMonthData?.returnVisits?.month,
                )})`}
              />
              <ListItem
                title="Estudos"
                value={`${bestMonthData?.students?.value} (${capitalizeString(
                  bestMonthData?.students?.month,
                )})`}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
