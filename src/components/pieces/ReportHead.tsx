import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronLeftCircle } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ReportHead({ onclick }: { onclick(): void }) {
  const safeArea = useSafeAreaInsets()
  return (
    <View
      className="h-16 shadow-lg w-full px-4 align-middle bg-white"
      style={{ paddingTop: safeArea.top }}
    >
      <TouchableOpacity
        onPress={onclick}
        className="flex-row items-center gap-1"
        activeOpacity={0.7}
      >
        <ChevronLeftCircle strokeWidth={1.5} size={28} color="black" />
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  )
}
