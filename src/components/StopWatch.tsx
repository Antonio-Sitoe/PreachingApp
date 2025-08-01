import { View, Text, Dimensions, useWindowDimensions } from 'react-native';
import { useStopWatch } from '@/hooks/useStopWatch';
import { ButtonStopWatch } from './ui/ButtonStopWatch';

import useTheme from '@/hooks/useTheme';
import Colors from '@/constants/Colors';
import Snackbar from 'react-native-snackbar';

interface DataProps {
  hours: number;
  minutes: number;
}
interface StopWatchProps {
  onPress(data: DataProps | undefined): void;
}

export function StopWatch({ onPress }: StopWatchProps) {
  const { isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive breakpoints
  const isSmallScreen = screenWidth < 350;
  const isMediumScreen = screenWidth >= 350 && screenWidth < 600;

  const { time, start, stop, isTop, isRunning, reset, STOP_WATCH_TIMES } =
    useStopWatch();

  function handleResetTimerAndAddReports() {
    const hours = Number(time.slice(0, 2));
    const minutes = Number(time.slice(3, 5));

    if (minutes >= 1) {
      onPress({
        hours,
        minutes,
      });
    } else if (isRunning) {
      Snackbar.show({
        text: 'Tempo menos de 1 minuto não é Salvo',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'orange',
        textColor: 'black',
      });
    }
    reset();
  }

  return (
    <View
      style={{
        borderColor: isDark ? 'white' : Colors.light.tint,
        backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
        paddingTop: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
        paddingHorizontal: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
        paddingBottom: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
      }}
      className={`w-full
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
          style={{
            color: isDark ? 'white' : Colors.light.tint,
            fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
          }}
          className="text-primary font-titleIBM dark:text-white"
        >
          CRONOMETRO DE SERVIÇO
        </Text>
      </View>

      <View
        className="flex-1 flex-row gap-1 pt-2 items-end justify-between mt-6"
        style={{
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: isSmallScreen ? 'center' : 'flex-end',
          gap: isSmallScreen ? 16 : 8,
        }}
      >
        <View style={{ alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
          <Text
            style={{
              color: isDark ? 'white' : Colors.light.tint,
              fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
            }}
            className="font-textIBM text-primary dark:text-white"
          >
            Total de Horas hoje
          </Text>
          <Text
            style={{
              color: isDark ? 'white' : Colors.light.tint,
              fontSize: isSmallScreen ? 32 : isMediumScreen ? 40 : 48,
            }}
            className="font-text mt-2 text-primary dark:text-white"
          >
            {time}.
            <Text
              style={{
                fontSize: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
              }}
            >
              {STOP_WATCH_TIMES.seconds}
            </Text>
          </Text>
        </View>

        <View
          className="flex flex-row items-center justify-between"
          style={{
            flexDirection: isSmallScreen ? 'row' : 'row',
            gap: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
            width: isSmallScreen ? '100%' : 'auto',
            justifyContent: isSmallScreen ? 'space-around' : 'flex-end',
          }}
        >
          <ButtonStopWatch
            iconName="stop"
            text="Terminar"
            onPress={handleResetTimerAndAddReports}
            isSmallScreen={isSmallScreen}
            isMediumScreen={isMediumScreen}
          />
          {isRunning ? (
            <ButtonStopWatch
              iconName="pause"
              onPress={stop}
              text="Pausar"
              isSmallScreen={isSmallScreen}
              isMediumScreen={isMediumScreen}
            />
          ) : isTop ? (
            <ButtonStopWatch
              iconName="play-circle"
              onPress={start}
              text="Continuar"
              isSmallScreen={isSmallScreen}
              isMediumScreen={isMediumScreen}
            />
          ) : (
            <ButtonStopWatch
              iconName="play"
              onPress={start}
              text="Iniciar"
              isSmallScreen={isSmallScreen}
              isMediumScreen={isMediumScreen}
            />
          )}
        </View>
      </View>
    </View>
  );
}
