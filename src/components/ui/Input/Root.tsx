import { ReactNode } from 'react'
import { Text, View } from 'react-native'

interface InputProps {
  children: ReactNode
  label: string
}
export function Root({ children, label }: InputProps) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="font-textIBM text-base ml-1 mb-1 mr-6">{label}</Text>
      <View className="flex-row">{children}</View>
    </View>
  )
}
