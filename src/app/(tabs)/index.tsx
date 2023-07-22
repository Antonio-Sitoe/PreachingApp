import { Clock3 } from 'lucide-react-native'
import { StopWatch } from '@/components/StopWatch'
import { Text, View, ScrollView } from 'react-native'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Cards from '@/components/Cards'

export default function TabOneScreen() {
  const { isDark } = useTheme()
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
    >
      <View className="flex-1 pt-8 px-4" style={{ flex: 1 }}>
        <StopWatch />
        <Text className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white">
          Relatório do mês atual{' '}
        </Text>
        <View className="flex flex-row gap-4">
          <Cards content="6:00" title="Horas" />
          <Cards content="2" title="Videos" />
        </View>
        <View className="flex w-full mt-4">
          <Cards content="5" title="Publicações" />
        </View>
        <View className="flex flex-row gap-4">
          <Cards content="6:00" title="Horas" />
          <Cards content="2" title="Videos" />
        </View>
      </View>
    </ScrollView>
  )
}
