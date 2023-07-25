import { View, Text } from 'react-native'
import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'

interface ICardsProps {
  title: string
  content: string
  Icon: any
}
export default function Cards({ title, content, Icon }: ICardsProps) {
  const { isDark } = useTheme()

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
        borderColor: isDark ? 'white' : Colors.light.tint,
        boxShadow:
          ' var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
      }}
      className="p-3 shadow-sm flex-1 border-2 border-solid border-primary rounded-3xl w-full bg-white"
    >
      <View
        style={{
          borderWidth: isDark ? 0 : 1,
          borderStyle: 'solid',
          borderColor: Colors.light.tint,
          width: 56,
          height: 56,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          backgroundColor: '#EAFBE7',
        }}
        className="flex-1 items-center justify-center w-14 h-14 rounded-full bg-[#EAFBE7] dark:bg-[#EAFBE7]"
      >
        <Icon
          strokeWidth={1.5}
          size={28}
          color={isDark ? Colors.dark.darkBgSecundary : Colors.light.tint}
        />
      </View>
      <View className="flex items-end justify-end">
        <Text
          style={{ color: isDark ? 'white' : Colors.light.tint }}
          className="text-base text-primary font-titleIBM uppercase dark:text-white"
        >
          {title}
        </Text>
        <Text
          style={{ color: isDark ? 'white' : Colors.light.tint }}
          className="text-primary font-text text-[37px] mt-0 leading-[45px] uppercase dark:text-white"
        >
          {content}
        </Text>
      </View>
    </View>
  )
}
