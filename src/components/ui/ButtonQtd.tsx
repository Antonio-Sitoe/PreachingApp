import { View, Text } from 'react-native'
import React from 'react'
import { Minus, Plus } from 'lucide-react-native'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface ButtonQtdProps {
  Increment(): void
  decrement(): void
}

export default function ButtonQtd({ Increment, decrement }: ButtonQtdProps) {
  const { isDark } = useTheme()
  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.Success200 : Colors.light.tint,
      }}
      className={`flex-row align-middle  justify-between p-1 rounded-xl`}
    >
      <TouchableOpacity
        onPress={decrement}
        className="h-9 w-9 items-center justify-center"
      >
        <Text className="text-white">
          <Minus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={Increment}
        className="h-9 w-9 items-center justify-center"
      >
        <Text className="text-white">
          <Plus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
    </View>
  )
}
