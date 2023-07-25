import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Minus, Plus } from 'lucide-react-native'
import { View, Text, TouchableOpacity } from 'react-native'

interface ButtonQtdProps {
  Increment(): void
  decrement(): void
}
export function Actions({ Increment, decrement }: ButtonQtdProps) {
  const { isDark } = useTheme()
  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.Success200 : Colors.light.tint,
      }}
      className="flex-row w-20 align-middle justify-between bg-primary rounded-xl"
    >
      <TouchableOpacity
        onPress={decrement}
        style={{
          height: 'auto',
          width: '50%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-white text-xl">
          <Minus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={Increment}
        style={{
          height: 'auto',
          width: '50%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-white text-xl">
          <Plus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
    </View>
  )
}
