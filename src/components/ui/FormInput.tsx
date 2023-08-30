import Colors from '@/constants/Colors'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import ButtonQtd from './ButtonQtd'
import useTheme from '@/hooks/useTheme'
import { Text } from '../Themed'

interface IFormInput {
  title: string
  value: string | number
  change(Fun: any): void
  inCrementValue(): void
  decrementValue(): void
  style?: any
}

export const FormInput = ({
  title,
  value,
  change,
  inCrementValue,
  decrementValue,
  ...rest
}: IFormInput) => {
  const { isDark } = useTheme()
  return (
    <View className="flex-1 mt-1" {...rest}>
      <Text className="font-textIBM text-base ml-1 mb-1 dark:text-white">
        {title}
      </Text>
      <View
        className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl"
        style={{
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.ligtInputbG,
        }}
      >
        <TextInput
          style={{
            color: isDark ? 'white' : 'black',
          }}
          value={`${value}`}
          keyboardType="numeric"
          onChangeText={change}
        />

        <ButtonQtd Increment={inCrementValue} decrement={decrementValue} />
      </View>
    </View>
  )
}
