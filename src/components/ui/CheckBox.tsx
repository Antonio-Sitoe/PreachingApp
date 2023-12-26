import { TouchableOpacityProps, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { View, Text } from '../Themed'
import Colors from '@/constants/Colors'

interface CheckboxProps extends TouchableOpacityProps {
  checked?: boolean
  title: string
}

export function CheckBox({ title, checked = false, ...props }: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center w-[45%]"
      {...props}
    >
      {checked ? (
        <View
          darkColor={Colors.dark.tint}
          lightColor={Colors.light.tint}
          className="h-8 w-8 rounded-lg items-center justify-center"
        >
          <Feather name="check" size={20} color={colors.white} />
        </View>
      ) : (
        <View
          darkColor={Colors.dark.darkBgSecundary}
          lightColor={Colors.light.inputBg}
          className="h-8 w-8 rounded-lg items-center justify-center"
        />
      )}
      <Text className="ml-3 text-semibold">{title}</Text>
    </TouchableOpacity>
  )
}
