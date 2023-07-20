import { StopWatch } from '@/components/StopWatch'
import { ScrollView } from 'react-native-gesture-handler'

export default function TabOneScreen() {
  return (
    <ScrollView className="flex-1 pt-8 px-4 bg-[#F6F6F9] dark:bg-stone-900">
      <StopWatch />
    </ScrollView>
  )
}
