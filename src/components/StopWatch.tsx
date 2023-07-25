import { View, Text, Dimensions } from 'react-native'
import { useStopWatch } from '@/hooks/useStopWatch'
import { ButtonStopWatch } from './ui/ButtonStopWatch'

import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'

export function StopWatch() {
  const { isDark } = useTheme()
  const screenwidth = Dimensions.get('window').width < 350
  const { time, start, stop, isTop, isRunning, reset, STOP_WATCH_TIMES } =
    useStopWatch()

  return (
    <View
      style={{
        borderColor: isDark ? 'white' : Colors.light.tint,
        backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
      }}
      className={`w-full pt-5 px-5 pb-6
        shadow 
        bg-white border-primary
       rounded-tl-[20px]
       rounded-tr-[20px]
       rounded-bl-[30px]
       rounded-br-[30px]
       border-2 border-solid`}
    >
      <View>
        <Text
          style={{ color: isDark ? 'white' : Colors.light.tint }}
          className="text-primary font-titleIBM text-base dark:text-white"
        >
          CRONOMETRO DE SERVIÇO
        </Text>
      </View>
      <View className="flex-1 flex-row gap-1 pt-2 items-end justify-between mt-6">
        <View>
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className="font-textIBM text-primary dark:text-white"
          >
            Total de Horas hoje
          </Text>
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className={`font-text ${
              screenwidth ? 'text-4xl' : 'text-5xl'
            } mt-2 text-primary dark:text-white`}
          >
            {time}.
            <Text style={{ fontSize: 12 }}>{STOP_WATCH_TIMES.seconds}</Text>
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between gap-3">
          <ButtonStopWatch iconName="stop" text="Terminar" onPress={reset} />
          {isRunning ? (
            <ButtonStopWatch iconName="pause" onPress={stop} text="Pausar" />
          ) : isTop ? (
            <ButtonStopWatch
              iconName="play-circle"
              onPress={start}
              text="Continuar"
            />
          ) : (
            <ButtonStopWatch iconName="play" onPress={start} text="Iniciar" />
          )}
        </View>
      </View>
    </View>
  )
}
