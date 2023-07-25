import { IconIOS } from '@/assets/icons/Icon'
import { Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface IButtonStopWatchProps {
  onPress?: () => void
  text: string
  iconName: React.ComponentProps<typeof Ionicons>['name']
}

export function ButtonStopWatch({
  onPress,
  text,
  iconName,
}: IButtonStopWatchProps) {
  const { isDark } = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex items-center justify-center p-2 min-w-[70px]"
    >
      <IconIOS
        name={iconName}
        size={40}
        color={isDark ? Colors.dark.text : Colors.light.tint}
      />
      <Text
        style={{ color: isDark ? 'white' : Colors.light.tint }}
        className="font-textIBM text-[12px] text-primary dark:text-white"
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}
