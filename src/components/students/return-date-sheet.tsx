import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/text-field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { TIMES_OF_DAY } from '@/constants/students';
import { appointmentsActions, type ReturnOn } from '@/database/actions';
import type { AppointmentTimeOfDay } from '@/database/schemas';
import { dayKey, formatDaysFromToday, formatReturnSummary } from '@/utils/students/return-date';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MonthCalendar } from './month-calendar';

type ReturnDateSheetProps = {
  open: boolean;
  name: string;
  address?: string | null;
  value: ReturnOn;
  onConfirm: (value: ReturnOn) => void;
  onClose: () => void;
};

function ReturnDateSheet({ open, name, address, value, onConfirm, onClose }: ReturnDateSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);
  // Handle nativo, margem de cima e os dois botões ficam de fora do scroll.
  const scrollMaxHeight = Math.max(220, height - insets.top - bottomInset - 220);
  const [date, setDate] = React.useState(value.date);
  const [timeOfDay, setTimeOfDay] = React.useState<AppointmentTimeOfDay>(value.timeOfDay ?? 'any');
  const [month, setMonth] = React.useState(value.date);

  React.useEffect(() => {
    if (!open) return;
    setDate(value.date);
    setTimeOfDay(value.timeOfDay ?? 'any');
    setMonth(value.date);
  }, [open, value]);

  const monthKey = dayjs(month).format('YYYY-MM');
  const { data: scheduledDays = [] } = useQuery({
    queryKey: ['appointments', 'scheduled-days', monthKey],
    queryFn: () => appointmentsActions.getScheduledDays(month),
    enabled: open,
  });
  const scheduled = React.useMemo(() => new Set(scheduledDays), [scheduledDays]);

  const subtitle = [name.trim(), address].filter(Boolean).join(' · ');
  const hasVisits = scheduled.has(dayKey(date));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      className="pb-0"
      style={{ paddingBottom: bottomInset }}>
      <ScrollView
        style={{ maxHeight: scrollMaxHeight }}
        contentContainerClassName="gap-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled>
        <View className="items-center gap-1">
          <Text variant="titleL">Quando voltas?</Text>
          {subtitle ? (
            <Text variant="bodyS" className="text-center text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <MonthCalendar
          month={month}
          selected={date}
          scheduledDays={scheduled}
          onMonthChange={setMonth}
          onSelect={setDate}
        />

        <View className="gap-2">
          <FieldLabel>
            A que horas? <Text className="text-muted-foreground">(opcional)</Text>
          </FieldLabel>
          <SegmentedControl
            accessibilityLabel="A que horas?"
            options={TIMES_OF_DAY}
            value={timeOfDay}
            onChange={setTimeOfDay}
          />
        </View>

        <View className="flex-row items-center gap-3 rounded-lg bg-secondary p-4">
          <View className="size-11 items-center justify-center rounded-md bg-card">
            <AppIcon name="calendar" size={20} className="text-primary" />
          </View>
          <View className="flex-1 gap-0.5">
            <Text variant="titleS" className="text-primary-strong">
              {formatReturnSummary(date, timeOfDay)}
            </Text>
            <Text variant="bodyS" className="text-muted-foreground">
              {formatDaysFromToday(date)}.{' '}
              {hasVisits
                ? 'Nesse dia já tens visitas marcadas.'
                : 'Nesse dia ainda não tens visitas marcadas.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="gap-1 border-t border-border pt-3">
        <Button onPress={() => onConfirm({ date, timeOfDay })}>
          <Text>Usar este dia</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>
    </BottomSheet>
  );
}

export { ReturnDateSheet };
export type { ReturnDateSheetProps };
