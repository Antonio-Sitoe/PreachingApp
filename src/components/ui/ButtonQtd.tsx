import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Minus, Plus } from 'lucide-react-native'

interface ButtonQtdProps {
  Increment(): void
  decrement(): void
}

export default function ButtonQtd({ Increment, decrement }: ButtonQtdProps) {
  return (
    <View className="flex-row align-middle justify-between  bg-primary p-1 rounded-xl">
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
          <Minus color="white" />
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
          <Plus color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  )
}
