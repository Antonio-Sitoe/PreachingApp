import { IconIOS } from '@/assets/icons/Icon'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'
import { useState } from 'react'

export function StopWatch() {
  const [isPause, setIspause] = useState(false)
  const { isDark } = useTheme()

  return (
    <View className="w-full pt-5 px-5 pb-6 bg-white shadow rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[30px] border-2 border-solid border-primary">
      <View>
        <Text className="text-primary font-titleIBM text-base">
          CRONOMETRO DE SERVIÇO
        </Text>
      </View>
      <View className="flex-1 flex-row pt-2 items-end justify-between mt-6">
        <View>
          <Text className="font-textIBM text-primary">Total de Horas hoje</Text>
          <Text className="font-text text-5xl mt-2 text-primary">04:23</Text>
        </View>
        <View
          style={{ flexDirection: 'row' }}
          className="flex flex-row items-center justify-between gap-2"
        >
          <TouchableOpacity className="flex items-center justify-center p-2">
            <IconIOS name="stop" size={40} color={Colors.light.tint} />
            <Text className="font-textIBM text-[12px] text-primary">
              Terminar
            </Text>
          </TouchableOpacity>
          {isPause ? (
            <TouchableOpacity
              className="flex items-center justify-center p-2"
              onPress={() => {
                setIspause(!isPause)
              }}
            >
              <IconIOS name="play" size={40} color={Colors.light.tint} />
              <Text className="font-textIBM text-[12px] text-primary">
                Iniciar
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIspause(!isPause)
              }}
              className="flex items-center justify-center p-2"
            >
              <IconIOS name="pause" size={40} color={Colors.light.tint} />
              <Text className="font-textIBM text-[12px] text-primary">
                Pausar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
