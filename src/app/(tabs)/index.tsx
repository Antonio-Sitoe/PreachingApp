import { StopWatch } from '@/components/StopWatch'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default function TabOneScreen() {
  const { isDark } = useTheme()
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
    >
      <View className="flex-1 pt-8 px-4">
        <StopWatch />
      </View>
    </ScrollView>
  )
}
