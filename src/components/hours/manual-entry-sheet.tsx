import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { timeEntriesActions } from '@/database/actions';
import { formatEntryDay } from '@/utils/hours/format';
import DateTimePicker, { type DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { DurationField } from './duration-field';

type ManualEntrySheetProps = {
  open: boolean;
  onClose: () => void;
};

function dayLabel(date: Date) {
  const day = dayjs(date);
  const short = formatEntryDay(date).split(', ')[1];
  if (day.isSame(dayjs(), 'day')) return `Hoje, ${short}`;
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) return `Ontem, ${short}`;
  return formatEntryDay(date);
}

function ManualEntrySheet({ open, onClose }: ManualEntrySheetProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = React.useState(() => new Date());
  const [minutes, setMinutes] = React.useState(60);
  const [picking, setPicking] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setDate(new Date());
    setMinutes(60);
  }, [open]);

  const onDateChange = (_event: DateTimePickerChangeEvent, next: Date) => {
    setPicking(false);
    setDate(next);
  };

  const save = async () => {
    setSaving(true);
    try {
      // Meio-dia local, para o dia não mudar ao passar para UTC.
      const startedAt = dayjs(date).hour(12).minute(0).second(0).millisecond(0).toISOString();
      const entry = await timeEntriesActions.create({ startedAt, minutes, source: 'manual' });
      await queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      onClose();
      showToast({
        message: 'Horas adicionadas',
        action: {
          label: 'Desfazer',
          icon: 'undo',
          onPress: async () => {
            await timeEntriesActions.remove(entry.id);
            await queryClient.invalidateQueries({ queryKey: ['time-entries'] });
          },
        },
      });
    } catch {
      showToast({ message: 'Não foi possível guardar. Tenta de novo.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Adicionar horas">
      <View className="gap-2">
        <FieldLabel>Dia</FieldLabel>
        <Pressable
          role="button"
          accessibilityLabel={`Dia, ${dayLabel(date)}`}
          onPress={() => setPicking(true)}
          className="min-h-12 flex-row items-center gap-3 rounded-lg border border-input bg-card px-4 active:bg-secondary">
          <AppIcon name="calendar" size={20} className="text-muted-foreground" />
          <Text className="flex-1">{dayLabel(date)}</Text>
          <AppIcon name="chevron-down" size={18} className="text-muted-foreground" />
        </Pressable>
      </View>

      <DurationField minutes={minutes} onChange={setMinutes} />

      <View className="gap-1">
        <Button disabled={saving || minutes <= 0} onPress={save}>
          <Text>Guardar</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>

      {picking ? (
        <DateTimePicker
          value={date}
          mode="date"
          maximumDate={new Date()}
          onValueChange={onDateChange}
          onDismiss={() => setPicking(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

export { ManualEntrySheet };
