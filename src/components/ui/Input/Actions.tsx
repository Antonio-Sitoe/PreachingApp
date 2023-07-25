import { Minus, Plus } from 'lucide-react-native'
import { View, Text, TouchableOpacity } from 'react-native'

interface ButtonQtdProps {
  Increment(): void
  decrement(): void
}
export function Actions({ Increment, decrement }: ButtonQtdProps) {
  return (
    <View className="flex-row w-28 align-middle justify-between bg-primary p-1 rounded-xl">
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
          <Minus color="white" />
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
          <Plus color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  )
}
