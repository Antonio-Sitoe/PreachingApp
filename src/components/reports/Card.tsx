import dayjs from 'dayjs'

import { Text, View } from '../Themed'
import { ReportData } from '@/@types/interfaces'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { calculeTotalNumbers } from '@/utils/calculeTotalNumbers'

export const Card = ({
  data,
  year,
}: {
  data: Array<[string, ReportData[]]>
  year: string
}) =>
  data.map((report, index) => {
    const monthName = report[0] as string
    const listOfReports = report[1] as ReportData[]
    const { data } = calculeTotalNumbers(report[1])
    return (
      <View
        lightColor="#c1e9e2"
        className="bg-[] p-2 mb-4 rounded-lg"
        key={index + Math.random() * 50}
      >
        <View className="w-3 h-3 bg-indigo-500 rounded-full" />
        <View lightColor="#c1e9e2" className="pl-5 pb-5 pr-2">
          <Text className="text-black font-title text-base mb-1 uppercase">
            {monthName} ({year})
          </Text>
          <Text className="text-sm text-[#504F4F] font-subTitle capitalize">
            {`${data.time} Horas, ${data.publications} Publicações, ${data.videos} Videos mostrados, ${data.returnVisits} revisitas, ${data.students} estudantes`}
          </Text>
          {listOfReports.map((item, index) => {
            const date = dayjs(item.createdAt)
              .locale('pt-br')
              .format('dddd, D [de] MMMM [de] YYYY')
            return (
              <TouchableOpacity className="mt-3" key={item.id + ' ' + index}>
                <Text className="bg-dark-tint p-1 px-2 mb-1 rounded-lg text-white capitalize">
                  {date}
                </Text>
                <Text className="ml-2">
                  {`${item.hours > 10 ? item.hours : '0' + item.hours}:${
                    item.minutes > 10 ? item.minutes : '0' + item.minutes
                  } Horas, ${item.publications} Publicações, ${
                    item.videos
                  } Videos mostrados, ${item.returnVisits} revisitas, ${
                    item.students
                  } estudantes`}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  })
