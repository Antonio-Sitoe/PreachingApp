import { Controller } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import useTheme from '@/hooks/useTheme'
import { View, Text } from '../Themed'

interface SelectProps {
  control: any
  name: string
  errors: any
  label: string
  options: {
    label: string
    value: string
  }[]
}
export function Select({ control, name, label, options, errors }: SelectProps) {
  const { isDark } = useTheme()
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field: { onChange, value } }) => (
        <View className="mt-4 rounded-lg">
          {label && (
            <Text className="text-sm font-normal mb-2 font-text">{label}</Text>
          )}
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            className={`bg-neutral-800 rounded-lg mt-2 px-3 text-white`}
            style={{
              backgroundColor: isDark ? Colors.dark.darkBgSecundary : `#D9D8FF`,
              borderColor: isDark ? '#38444d3e' : 'transparent',
              borderWidth: isDark ? 1 : 0,
              color: isDark ? `#D9D8FF` : '#252525',
            }}
          >
            {options.map((item, index) => {
              return (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={index}
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter_400Regular',
                    borderRadius: 12,
                  }}
                />
              )
            })}
          </Picker>
          {errors[name]?.message && (
            <Text className="text-[12px] ml-2 text-red-600">
              {errors[name]?.message}
            </Text>
          )}
        </View>
      )}
    />
  )
}
