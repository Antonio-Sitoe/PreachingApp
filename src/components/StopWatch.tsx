import { View, Text } from 'react-native'
import { useStopWatch } from '@/hooks/useStopWatch'
import { ButtonStopWatch } from './ui/ButtonStopWatch'

import useTheme from '@/hooks/useTheme'

export function StopWatch() {
  const { isDark } = useTheme()
  const { time, start, stop, isTop, isRunning, reset, STOP_WATCH_TIMES } =
    useStopWatch()

  return (
    <View
      className={`w-full pt-5 px-5 pb-6
      ${
        isDark
          ? 'bg-dark-darkBgSecundary border-white'
          : 'bg-white border-primary'
      }
        shadow 
       rounded-tl-[20px]
       rounded-tr-[20px]
       rounded-bl-[30px]
       rounded-br-[30px]
       border-2 border-solid`}
    >
      <View>
        <Text className="text-primary font-titleIBM text-base dark:text-white">
          CRONOMETRO DE SERVIÇO
        </Text>
      </View>
      <View className="flex-1 flex-row pt-2 items-end justify-between mt-6">
        <View>
          <Text className="font-textIBM text-primary dark:text-white">
            Total de Horas hoje
          </Text>
          <Text className="font-text text-5xl mt-2 text-primary dark:text-white">
            {time}.
            <Text style={{ fontSize: 12 }}>{STOP_WATCH_TIMES.seconds}</Text>
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row' }}
          className="flex flex-row items-center justify-between gap-3"
        >
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
