import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useElapsed, useTimer } from '@/hooks/use-timer';
import { formatClock, formatTimeOfDay } from '@/utils/hours/format';
import { View } from 'react-native';
import { canShowTimerNotification } from '../../../modules/timer-notification';

type TimerCardProps = {
  onManual: () => void;
};

function TimerCard({ onManual }: TimerCardProps) {
  const { state, start, pause, resume, finish } = useTimer();
  const elapsed = useElapsed(state);
  const idle = state.status === 'idle';

  const caption =
    state.status === 'running'
      ? `A contar desde as ${formatTimeOfDay(state.startedAt)}`
      : state.status === 'paused'
        ? 'Em pausa'
        : 'Cronómetro parado';

  return (
    <View className="items-center gap-4 rounded-lg border border-border bg-card px-4 py-6">
      <View className="items-center gap-1">
        <Text
          role="timer"
          className="font-display text-[45px] leading-[48px] text-primary-strong">
          {formatClock(elapsed)}
        </Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {caption}
        </Text>
      </View>

      <View className="flex-row gap-2 self-stretch">
        {idle ? (
          <>
            <Button className="flex-1 flex-row gap-2" onPress={start}>
              <AppIcon name="play" size={18} className="text-primary-foreground" />
              <Text>Iniciar</Text>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 border border-border bg-card"
              onPress={onManual}>
              <Text>À mão</Text>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="flex-1 border border-border bg-card"
              onPress={state.status === 'running' ? pause : resume}>
              <Text className="text-foreground">
                {state.status === 'running' ? 'Pausar' : 'Retomar'}
              </Text>
            </Button>
            <Button className="flex-1" onPress={() => void finish()}>
              <Text>Terminar</Text>
            </Button>
          </>
        )}
      </View>

      {!idle && !canShowTimerNotification() ? (
        <Text variant="bodyS" className="text-center text-muted-foreground">
          As notificações estão desligadas: o cronómetro conta na mesma, mas não aparece fora do app.
        </Text>
      ) : null}
    </View>
  );
}

export { TimerCard };
