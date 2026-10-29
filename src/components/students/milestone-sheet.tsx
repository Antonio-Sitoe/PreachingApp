import { TagChip } from '@/components/notes/list';
import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { milestonesActions } from '@/database/actions';
import { formatPickedDay, MILESTONE_EXAMPLES } from '@/utils/students/journey';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type MilestoneSheetProps = {
  open: boolean;
  studentId: string;
  onClose: () => void;
};

function MilestoneSheet({ open, studentId, onClose }: MilestoneSheetProps) {
  const queryClient = useQueryClient();
  const [label, setLabel] = React.useState('');
  const [error, setError] = React.useState<string>();
  const [date, setDate] = React.useState(() => new Date());
  const [pickingDate, setPickingDate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setLabel('');
    setError(undefined);
    setDate(new Date());
    setPickingDate(false);
    setSaving(false);
  }, [open]);

  function onDateChange(_event: DateTimePickerChangeEvent, next: Date) {
    setPickingDate(false);
    setDate(next);
  }

  async function save() {
    if (!label.trim()) {
      setError('Escreve o que aconteceu, ou escolhe um exemplo.');
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await milestonesActions.create({
        studentId,
        label,
        occurredAt: dayjs(date).format('YYYY-MM-DD'),
      });
      await queryClient.invalidateQueries({ queryKey: ['milestones', studentId] });
      showToast({ message: 'Marco guardado.' });
      onClose();
    } catch {
      setSaving(false);
      showToast({ message: 'Não foi possível guardar. Tenta outra vez.' });
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text variant="titleL" className="text-center">
        Novo marco
      </Text>

      <TextField
        label="O que aconteceu"
        value={label}
        onChangeText={(value) => {
          setLabel(value);
          if (error) setError(undefined);
        }}
        error={error}
        autoCapitalize="sentences"
      />

      <View className="gap-2">
        <FieldLabel>Exemplos</FieldLabel>
        <View role="group" aria-label="Exemplos" className="flex-row flex-wrap gap-2">
          {MILESTONE_EXAMPLES.map((example) => (
            <TagChip
              key={example}
              label={example}
              active={label === example}
              onPress={() => {
                setLabel(example);
                setError(undefined);
              }}
            />
          ))}
        </View>
      </View>

      <View className="gap-2">
        <FieldLabel>Quando</FieldLabel>
        <Pressable
          role="button"
          accessibilityLabel={`Quando: ${formatPickedDay(date)}`}
          onPress={() => setPickingDate(true)}
          className="h-[52px] flex-row items-center gap-2.5 rounded-lg border border-input bg-card px-4 active:bg-secondary">
          <AppIcon name="calendar" size={18} className="text-primary" />
          <Text className="flex-1 text-[14px]">{formatPickedDay(date)}</Text>
        </Pressable>
      </View>

      <View className="gap-1">
        <Button disabled={saving} onPress={save}>
          <Text>{saving ? 'A guardar…' : 'Guardar marco'}</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" disabled={saving} onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>

      {pickingDate ? (
        <DateTimePicker
          value={date}
          mode="date"
          maximumDate={new Date()}
          onValueChange={onDateChange}
          onDismiss={() => setPickingDate(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

export { MilestoneSheet };
export type { MilestoneSheetProps };
