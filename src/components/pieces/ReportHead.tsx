import { View, TouchableOpacity } from 'react-native'
import { ChevronLeftCircle } from 'lucide-react-native'
import { Text } from '../Themed'

import Colors from '@/constants/Colors'

export default function ReportHead({
  onclick,
  isDark,
}: {
  onclick(): void
  isDark: boolean
}) {
  return (
    <View
      className="h-16 flex flex-col justify-center shadow-lg w-full px-4 align-middle bg-white"
      style={{
        backgroundColor: isDark ? Colors.dark.background : 'white',
      }}
    >
      <TouchableOpacity
        onPress={onclick}
        className="flex-row items-center gap-1"
        activeOpacity={0.7}
      >
        <ChevronLeftCircle
          strokeWidth={1.5}
          size={28}
          color={isDark ? 'white' : 'black'}
        />
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  )
}
