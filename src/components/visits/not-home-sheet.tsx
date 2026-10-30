import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { visitsActions } from '@/database/actions';
import type { Visit } from '@/database/schemas';
import { cn } from '@/utils/cn';
import { shortName } from '@/utils/students/journey';
import { daysAhead, formatShortDay, nextSaturday } from '@/utils/students/return-date';
import { timeOf } from '@/utils/visits/format';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type NotHomeSheetProps = {
  visit: Visit | null;
  studentName: string;
  onUndo: () => void;
  onDone: () => void;
};

function NotHomeSheet({ visit, studentName, onUndo, onDone }: NotHomeSheetProps) {
  const queryClient = useQueryClient();
  const [retryOn, setRetryOn] = React.useState<Date | null>(null);
  const [pickingDate, setPickingDate] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!visit) return;
    setRetryOn(null);
    setPickingDate(false);
    setBusy(false);
  }, [visit]);

  if (!visit) return null;

  const visitedAt = dayjs(visit.visitedAt);
  const when = visitedAt.isSame(dayjs(), 'day')
    ? 'hoje'
    : `a ${formatShortDay(visitedAt.toDate())}`;
  const saturday = nextSaturday();
  const options = [
    { label: 'Amanhã', date: daysAhead(1) },
    { label: formatShortDay(saturday), date: saturday },
    { label: 'Próxima semana', date: daysAhead(7) },
  ].filter(
    (option, index, all) =>
      all.findIndex((other) => dayjs(other.date).isSame(option.date, 'day')) === index
  );
  const custom = retryOn && !options.some((option) => dayjs(option.date).isSame(retryOn, 'day'));

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['students'] }),
      queryClient.invalidateQueries({ queryKey: ['visits'] }),
      queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    ]);
  }

  async function undo() {
    if (!visit || busy) return;
    setBusy(true);
    try {
      await visitsActions.remove(visit.id);
      await refresh();
      onUndo();
    } catch {
      setBusy(false);
      showToast({ message: 'Não foi possível desfazer. Tenta outra vez.' });
    }
  }

  async function finish() {
    if (!visit || busy) return;
    setBusy(true);
    try {
      if (retryOn) {
        await visitsActions.scheduleRetry(visit.studentId, retryOn);
        await refresh();
        showToast({ message: `Nova tentativa a ${formatShortDay(retryOn)}.` });
      }
      onDone();
    } catch {
      setBusy(false);
      showToast({ message: 'Não foi possível marcar a nova tentativa. Tenta outra vez.' });
    }
  }

  function onPicked(_event: DateTimePickerChangeEvent, date: Date) {
    setPickingDate(false);
    setRetryOn(date);
  }

  return (
    <BottomSheet open onClose={finish}>
      <View className="flex-row items-center gap-3">
        <View className="size-11 items-center justify-center rounded-full bg-success-soft">
          <AppIcon name="check" size={22} className="text-success" />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="titleM">Tentativa guardada</Text>
          <Text variant="bodyS" className="text-muted-foreground">
            {shortName(studentName)} não estava em casa {when} às {timeOf(visitedAt.toDate())}
          </Text>
        </View>
        <Button variant="ghost" size="sm" disabled={busy} onPress={undo}>
          <AppIcon name="undo" size={16} className="text-primary" />
          <Text>Desfazer</Text>
        </Button>
      </View>

      <View className="gap-2">
        <FieldLabel>Tentar de novo</FieldLabel>
        <View role="radiogroup" aria-label="Tentar de novo" className="flex-row flex-wrap gap-2">
          {options.map((option) => (
            <RetryOption
              key={option.label}
              label={option.label}
              selected={retryOn ? dayjs(option.date).isSame(retryOn, 'day') : false}
              onPress={() => setRetryOn(option.date)}
            />
          ))}
          <RetryOption
            label={custom && retryOn ? formatShortDay(retryOn) : 'Escolher data'}
            selected={Boolean(custom)}
            onPress={() => setPickingDate(true)}
          />
        </View>
      </View>

      <Button disabled={busy} onPress={finish}>
        <Text>Concluir</Text>
      </Button>

      {pickingDate ? (
        <DateTimePicker
          value={retryOn ?? daysAhead(1)}
          mode="date"
          minimumDate={daysAhead(1)}
          onValueChange={onPicked}
          onDismiss={() => setPickingDate(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

type RetryOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function RetryOption({ label, selected, onPress }: RetryOptionProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      onPress={onPress}
      className={cn(
        'min-h-12 grow basis-[45%] items-center justify-center rounded-lg border px-2 py-2',
        selected ? 'border-primary bg-secondary' : 'border-border bg-card active:bg-secondary'
      )}>
      <Text
        className={cn(
          'text-center font-display-medium text-[15px] leading-5',
          selected ? 'text-primary-strong' : 'text-foreground'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

export { NotHomeSheet };
export type { NotHomeSheetProps };
