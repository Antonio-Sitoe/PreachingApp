import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, View } from '../Themed'
import { ReportDataProps } from './ReportsList'

export const Card = ({ data }: { data: ReportDataProps }) => (
  <View lightColor="#c1e9e2" className="bg-[] p-2 mb-4 rounded-lg ">
    <View className="w-3 h-3 bg-indigo-500 rounded-full" />
    <View lightColor="#c1e9e2" className="pl-5 pb-5 pr-2">
      <Text className="text-black font-title text-base mb-1 uppercase">
        {data.name} ({data.year})
      </Text>
      <Text className="text-sm text-[#504F4F] font-subTitle capitalize">
        {data.totalText}
      </Text>
      {data.reports.map((item) => {
        return (
          <TouchableOpacity className="mt-3" key={item.id}>
            <Text className="bg-dark-tint p-1 px-2 mb-1 rounded-lg text-white capitalize">
              {item.date}
            </Text>
            <Text className="ml-2">{item.text}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  </View>
)
