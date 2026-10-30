import { TagChip } from '@/components/notes/list';
import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { PAUSE_REASON_OPTIONS } from '@/constants/students';
import { studentsActions } from '@/database/actions';
import type { PauseReason, Student } from '@/database/schemas';
import { cn } from '@/utils/cn';
import { shortName, withArticle } from '@/utils/students/journey';
import { formatDayMonth } from '@/utils/students/pause';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { refreshVisitData } from '@/utils/visits/refresh';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type PauseSheetProps = {
  open: boolean;
  student: Pick<Student, 'id' | 'displayName' | 'gender'>;
  onClose: () => void;
};

function PauseSheet({ open, student, onClose }: PauseSheetProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = React.useState<PauseReason | null>(null);
  const [note, setNote] = React.useState('');
  const [retryAt, setRetryAt] = React.useState<Date | null>(null);
  const [pickingDate, setPickingDate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setReason(null);
    setNote('');
    setRetryAt(null);
    setPickingDate(false);
    setSaving(false);
  }, [open]);

  function onDateChange(_event: DateTimePickerChangeEvent, next: Date) {
    setPickingDate(false);
    setRetryAt(next);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await studentsActions.pause(student.id, {
        reason: reason ?? 'other',
        note,
        retryAt: retryAt ? dayjs(retryAt).format('YYYY-MM-DD') : null,
      });
      await refreshVisitData(queryClient);
      showToast({ message: `${shortName(student.displayName)} está em pausa.` });
      onClose();
    } catch {
      setSaving(false);
      showToast({ message: 'Não foi possível pôr em pausa. Tenta outra vez.' });
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View className="gap-1">
        <Text variant="titleL" className="text-center">
          Pôr {withArticle(student.displayName, student.gender)} em pausa
        </Text>
        <Text variant="bodyS" className="text-center text-muted-foreground">
          Sai do Hoje e dos alertas. O histórico fica guardado.
        </Text>
      </View>

      <View className="gap-2">
        <FieldLabel>Motivo</FieldLabel>
        <View role="group" aria-label="Motivo" className="flex-row flex-wrap gap-2">
          {PAUSE_REASON_OPTIONS.map((option) => (
            <TagChip
              key={option.value}
              label={option.label}
              active={reason === option.value}
              onPress={() => setReason(reason === option.value ? null : option.value)}
            />
          ))}
        </View>
      </View>

      <TextField label="Nota (opcional)" value={note} onChangeText={setNote} />

      <View className="gap-2">
        <FieldLabel>Tentar de novo a</FieldLabel>
        <Pressable
          role="button"
          accessibilityLabel={`Tentar de novo a: ${retryAt ? formatDayMonth(retryAt) : 'sem data'}`}
          onPress={() => setPickingDate(true)}
          className="min-h-[52px] flex-row items-center gap-2.5 rounded-lg border border-input bg-card px-4 py-3 active:bg-secondary">
          <Text className={cn('flex-1 text-[14px]', !retryAt && 'text-muted-foreground')}>
            {retryAt ? formatDayMonth(retryAt) : 'Sem data (opcional)'}
          </Text>
          <AppIcon name="calendar" size={18} className="text-subtle" />
        </Pressable>
      </View>

      <View className="gap-1">
        <Button disabled={saving} onPress={save}>
          <Text>{saving ? 'A guardar…' : 'Pôr em pausa'}</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" disabled={saving} onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>

      {pickingDate ? (
        <DateTimePicker
          value={retryAt ?? dayjs().add(1, 'month').toDate()}
          mode="date"
          minimumDate={dayjs().add(1, 'day').toDate()}
          onValueChange={onDateChange}
          onDismiss={() => setPickingDate(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

export { PauseSheet };
export type { PauseSheetProps };
