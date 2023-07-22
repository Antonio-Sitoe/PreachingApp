import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { Clock3, LucideProps } from 'lucide-react-native'
import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'
type IconProps = LucideProps
interface ICardsProps {
  title: string
  content: string
  Icon: IconProps
}
export default function Cards({ title, content }: ICardsProps) {
  const { isDark } = useTheme()
  const name = Icon.name as LucideProps

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
        borderColor: isDark ? 'white' : Colors.dark.tint,
      }}
      className="p-3 flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white"
    >
      <View
        style={styles.icon}
        className="flex-1 items-center justify-center w-14 h-14 border-2 border-solid border-primary rounded-full bg-[#EAFBE7]"
      >
        <Icon strokeWidth={1.5} size={28} color="#4945FF" />
      </View>
      <View className="flex items-end justify-end">
        <Text className="text-base text-primary font-titleIBM uppercase dark:text-white">
          {title}
        </Text>
        <Text className="text-primary font-titleIBM text-[40px] mt-0 leading-[45px] uppercase dark:text-white">
          {content}
        </Text>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {},
  icon: {
    borderWidth: 2,
    borderStyle: 'solid',
  },
})
