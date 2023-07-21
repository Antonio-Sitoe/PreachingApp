import { StopWatch } from '@/components/StopWatch'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Clock3 } from 'lucide-react-native'
import { Text, View, ScrollView } from 'react-native'

export default function TabOneScreen() {
  const { isDark } = useTheme()
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        }}
      >
        <View className="flex-1 pt-8 px-4" style={{ flex: 1 }}>
          <StopWatch />
          <Text className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white">
            Relatório do mês atual{' '}
          </Text>
          <View className="flex flex-row gap-4">
            <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
              <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
                <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
              </View>
              <View className="flex items-end justify-end">
                <Text className="text-base text-primary font-titleIBM uppercase">
                  HORAS
                </Text>
                <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px] uppercase">
                  6:00
                </Text>
              </View>
            </View>
            <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
              <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
                <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
              </View>
              <View className="flex items-end justify-end">
                <Text className="text-base text-primary font-titleIBM uppercase">
                  Videos
                </Text>
                <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px]">
                  6:00
                </Text>
              </View>
            </View>
          </View>
          <View className="flex w-full mt-4">
            <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
              <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
                <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
              </View>
              <View className="flex items-end justify-end">
                <Text className="text-base text-primary font-titleIBM uppercase">
                  Videos
                </Text>
                <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px]">
                  6:00
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row gap-4 mt-2">
            <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
              <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
                <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
              </View>
              <View className="flex items-end justify-end">
                <Text className="text-base text-primary font-titleIBM uppercase">
                  HORAS
                </Text>
                <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px] uppercase">
                  6:00
                </Text>
              </View>
            </View>
            <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
              <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
                <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
              </View>
              <View className="flex items-end justify-end">
                <Text className="text-base text-primary font-titleIBM uppercase">
                  Videos
                </Text>
                <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px]">
                  6:00
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
