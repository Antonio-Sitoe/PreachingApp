import TouchableOpacity, { Text } from '@/components/Themed'
import Colors from '@/constants/Colors'

export function ButtonPrimary({ onPress, width = '134px', text }) {
  return (
    <TouchableOpacity
      lightColor={Colors.light.tint}
      darkColor={Colors.dark.tint}
      onPress={onPress}
      activeOpacity={0.6}
      className={`w-[${width}] mt-4 h-10 rounded-lg flex items-center justify-center`}
    >
      <Text className="font-text text-white text-sm font-normal">{text}</Text>
    </TouchableOpacity>
  )
}
