import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Dimensions, TextInputProps } from 'react-native'

import { TextInput } from 'react-native-gesture-handler'

interface InputContentProps extends TextInputProps {
  actions: boolean
}

export function Content({ actions }: InputContentProps) {
  const WindowWidth = Dimensions.get('window').width
  const { isDark } = useTheme()

  return (
    <TextInput
      style={{
        color: isDark ? 'white' : 'black',
        marginRight: actions ? 10 : 0,
        backgroundColor: isDark
          ? Colors.dark.background
          : Colors.light.ligtInputbG,
      }}
      placeholder="0"
      placeholderTextColor="#808080"
      className={`bg-ligtInputbG font-text h-[47px] ${
        WindowWidth < 350 ? 'w-16' : 'w-24'
      } pl-3 pr-1 py-3 rounded-xl`}
      keyboardType="numeric"
    />
  )
}
