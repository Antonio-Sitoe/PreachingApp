import { View, Text } from 'react-native'
import React from 'react'
import { Clock3 } from 'lucide-react-native'

interface ICardsProps {
  title: string
  content: string
}
export default function Cards({ title, content }: ICardsProps) {
  return (
    <View className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white">
      <View className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]">
        <Clock3 strokeWidth={1.5} size={28} color="#4945FF" />
      </View>
      <View className="flex items-end justify-end">
        <Text className="text-base text-primary font-titleIBM uppercase">
          {title}
        </Text>
        <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px] uppercase">
          {content}
        </Text>
      </View>
    </View>
  )
}
