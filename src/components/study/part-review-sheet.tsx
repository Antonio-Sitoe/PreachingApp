import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { lessonsActions } from '@/database/actions';
import type { Student } from '@/database/schemas';
import { ofName } from '@/utils/students/journey';
import { formatDayMonth } from '@/utils/students/pause';
import { BOOK_PARTS, partSize } from '@/utils/study/parts';
import { refreshVisitData } from '@/utils/visits/refresh';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type PartReviewSheetProps = {
  part: number | null;
  student: Pick<Student, 'id' | 'displayName' | 'gender'>;
  onClose: () => void;
};

function PartReviewSheet({ part, student, onClose }: PartReviewSheetProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = React.useState(() => new Date());
  const [note, setNote] = React.useState('');
  const [pickingDate, setPickingDate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (part === null) return;
    setDate(new Date());
    setNote('');
    setSaving(false);
  }, [part]);

  if (part === null) return null;
  const info = BOOK_PARTS[part - 1];

  async function save() {
    if (part === null || saving) return;
    setSaving(true);
    try {
      await lessonsActions.saveReview(student.id, part, date, note);
      await refreshVisitData(queryClient);
      showToast({ message: `Revisão da parte ${part} guardada como marco.` });
      onClose();
    } catch {
      setSaving(false);
      showToast({ message: 'Não foi possível guardar a revisão. Tenta outra vez.' });
    }
  }

  function onPicked(_event: DateTimePickerChangeEvent, value: Date) {
    setPickingDate(false);
    setDate(value);
  }

  return (
    <BottomSheet open onClose={onClose}>
      <View className="items-center gap-3">
        <View className="size-16 items-center justify-center rounded-full bg-success-soft">
          <AppIcon name="check" size={30} strokeWidth={3} className="text-success" />
        </View>
        <Text variant="titleL" className="text-center">
          Terminaram a parte {part}
        </Text>
        <Text className="text-center text-muted-foreground">
          As {partSize(info)} lições estão concluídas. A revisão da parte fica guardada como marco
          no percurso {ofName(student.displayName, student.gender)}.
        </Text>
      </View>

      <View className="gap-2">
        <FieldLabel>Fizeram a revisão a</FieldLabel>
        <Pressable
          role="button"
          accessibilityLabel={`Fizeram a revisão a: ${formatDayMonth(date)}`}
          onPress={() => setPickingDate(true)}
          className="min-h-[52px] flex-row items-center gap-2.5 rounded-lg border border-input bg-card px-4 py-3 active:bg-secondary">
          <Text className="flex-1 text-[14px]">{formatDayMonth(date)}</Text>
          <AppIcon name="calendar" size={18} className="text-subtle" />
        </Pressable>
      </View>

      <TextField label="Nota (opcional)" value={note} onChangeText={setNote} />

      <View className="gap-1">
        <Button disabled={saving} onPress={save}>
          <Text>Guardar como marco</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Ainda não fizemos a revisão</Text>
        </Button>
      </View>

      {pickingDate ? (
        <DateTimePicker
          value={date}
          mode="date"
          maximumDate={new Date()}
          onValueChange={onPicked}
          onDismiss={() => setPickingDate(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

export { PartReviewSheet };
export type { PartReviewSheetProps };
