import { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Controller, RegisterOptions, Control } from 'react-hook-form'
import { TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

interface ITextInputFormProps extends TextInputProps {
  rules: RegisterOptions
  label: string
  name: string
  placeholder: string
  control: Control<any>
  errors: any
  height?: boolean
}

export function TextInputForm({
  control,
  name,
  height = false,
  errors,
  placeholder,
  rules,
  label,
  ...props
}: ITextInputFormProps) {
  const { isDark } = useTheme()
  return (
    <View className="flex flex-1 mt-4" lightColor="transparent">
      {label && <Text className="text-sm font-normal font-text">{label}</Text>}
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholderTextColor={isDark ? `#a3afb73f` : '#848f963e'}
            value={value}
            {...props}
            className={`bg-neutral-800 ${
              height ? 'h-12' : ''
            } rounded-lg mt-2 p-3 text-white`}
            style={{
              backgroundColor: isDark ? Colors.dark.darkBgSecundary : `#D9D8FF`,
              borderColor: isDark ? '#a3afb73f' : 'transparent',
              borderWidth: isDark ? 1 : 0,
              color: isDark ? `#D9D8FF` : '#252525',
            }}
          />
        )}
        name={name}
      />
      {errors[name]?.message && (
        <Text className="text-[12px] ml-2 text-red-600">
          {errors[name]?.message}
        </Text>
      )}
    </View>
  )
}
