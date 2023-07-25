import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Minus, Plus } from 'lucide-react-native'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

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
      className={`flex-row align-middle justify-between p-1 rounded-xl`}
    >
      <TouchableOpacity
        onPress={decrement}
        style={{
          height: 32,
          width: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-white">
          <Minus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={Increment}
        style={{
          height: 32,
          width: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-white">
          <Plus color={isDark ? 'black' : 'white'} />
        </Text>
      </TouchableOpacity>
    </View>
  )
}
