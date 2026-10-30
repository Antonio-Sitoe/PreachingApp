import { TagChip } from '@/components/notes/list';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { daysAhead, nextSaturday } from '@/utils/students/return-date';
import { formatPickedDay } from '@/utils/students/journey';
import { fromTimeString, toTimeString } from '@/utils/students/form';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export const REMIND_OPTIONS = [
  { value: 0, label: 'Na hora' },
  { value: 30, label: '30 min antes' },
  { value: 60, label: '1 h antes' },
] as const;

export type RemindMinutes = (typeof REMIND_OPTIONS)[number]['value'];

export type NextVisitValue = {
  date: Date;
  /** HH:mm */
  time: string | null;
  remindMinutes: RemindMinutes;
};

type NextVisitSheetProps = {
  open: boolean;
  subtitle: string;
  rhythmDays: number;
  value: NextVisitValue;
  onConfirm: (value: NextVisitValue) => void;
  onClose: () => void;
};

function NextVisitSheet({
  open,
  subtitle,
  rhythmDays,
  value,
  onConfirm,
  onClose,
}: NextVisitSheetProps) {
  const [draft, setDraft] = React.useState(value);
  const [picking, setPicking] = React.useState<'date' | 'time' | null>(null);

  React.useEffect(() => {
    if (open) {
      setDraft(value);
      setPicking(null);
    }
  }, [open, value]);

  const shortcuts = [
    {
      label: `Daqui a ${rhythmDays} ${rhythmDays === 1 ? 'dia' : 'dias'}`,
      date: daysAhead(rhythmDays),
    },
    { label: 'Amanhã', date: daysAhead(1) },
    { label: 'Sábado', date: nextSaturday() },
    { label: 'Daqui a 14 dias', date: daysAhead(14) },
  ].filter(
    (shortcut, index, all) =>
      all.findIndex((other) => dayjs(other.date).isSame(shortcut.date, 'day')) === index
  );

  function onPicked(_event: DateTimePickerChangeEvent, next: Date) {
    const target = picking;
    setPicking(null);
    if (target === 'date') setDraft((current) => ({ ...current, date: next }));
    if (target === 'time') setDraft((current) => ({ ...current, time: toTimeString(next) }));
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View className="gap-1">
        <Text variant="titleL" className="text-center">
          Próxima visita
        </Text>
        <Text variant="bodyS" className="text-center text-muted-foreground">
          {subtitle}
        </Text>
      </View>

      <View role="group" aria-label="Atalhos" className="flex-row flex-wrap gap-2">
        {shortcuts.map((shortcut) => (
          <TagChip
            key={shortcut.label}
            label={shortcut.label}
            active={dayjs(draft.date).isSame(shortcut.date, 'day')}
            onPress={() => setDraft((current) => ({ ...current, date: shortcut.date }))}
          />
        ))}
      </View>

      <View className="flex-row gap-3">
        <PickerField
          label="Dia"
          value={formatPickedDay(draft.date)}
          icon="calendar"
          onPress={() => setPicking('date')}
        />
        <PickerField
          label="Hora"
          value={draft.time ?? 'Sem hora'}
          icon="clock"
          muted={!draft.time}
          onPress={() => setPicking('time')}
        />
      </View>

      <View className="gap-2">
        <FieldLabel>Avisar</FieldLabel>
        <SegmentedControl
          accessibilityLabel="Avisar"
          options={REMIND_OPTIONS}
          value={draft.remindMinutes}
          onChange={(remindMinutes) => setDraft((current) => ({ ...current, remindMinutes }))}
        />
      </View>

      <View className="gap-1">
        <Button onPress={() => onConfirm(draft)}>
          <Text>Marcar visita</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>

      {picking ? (
        <DateTimePicker
          value={picking === 'date' ? draft.date : fromTimeString(draft.time)}
          mode={picking}
          is24Hour
          minimumDate={picking === 'date' ? daysAhead(0) : undefined}
          onValueChange={onPicked}
          onDismiss={() => setPicking(null)}
        />
      ) : null}
    </BottomSheet>
  );
}

type PickerFieldProps = {
  label: string;
  value: string;
  icon: AppIconName;
  muted?: boolean;
  onPress: () => void;
};

function PickerField({ label, value, icon, muted, onPress }: PickerFieldProps) {
  return (
    <View className="min-w-0 flex-1 gap-2">
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        role="button"
        accessibilityLabel={`${label}: ${value}`}
        onPress={onPress}
        className="min-h-[52px] flex-row items-center gap-2.5 rounded-lg border border-input bg-card px-4 py-3 active:bg-secondary">
        <Text
          numberOfLines={1}
          className={muted ? 'flex-1 text-[14px] text-muted-foreground' : 'flex-1 text-[14px]'}>
          {value}
        </Text>
        <AppIcon name={icon} size={18} className="text-subtle" />
      </Pressable>
    </View>
  );
}

export { NextVisitSheet, PickerField };
export type { NextVisitSheetProps, PickerFieldProps };
