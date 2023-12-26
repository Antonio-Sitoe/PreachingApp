import TouchableOpacity, { Text } from '@/components/Themed'

export function ButtonPrimary({
  onPress,
  width = '134px',
  text,
  darkColor,
  lightColor,
}) {
  return (
    <TouchableOpacity
      darkColor={darkColor}
      lightColor={lightColor}
      onPress={onPress}
      className={`w-[${width}] mt-4 h-10 rounded-lg flex-1 items-center justify-center`}
    >
      <Text className="font-text text-white text-sm font-normal">{text}</Text>
    </TouchableOpacity>
  )
}
