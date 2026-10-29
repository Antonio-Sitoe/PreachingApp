import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { monthPlansActions } from '@/database/actions';
import type { PlanDay } from '@/database/schemas';
import { formatDuration, formatEntryDay } from '@/utils/hours/format';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { View } from 'react-native';
import { DurationField } from './duration-field';

type UpcomingDaysListProps = {
  days: PlanDay[];
};

function UpcomingDaysList({ days }: UpcomingDaysListProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = React.useState<PlanDay | null>(null);
  const [minutes, setMinutes] = React.useState(0);

  if (days.length === 0) return null;

  const open = (day: PlanDay) => {
    setEditing(day);
    setMinutes(day.plannedMinutes);
  };

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ['month-plans'] });
      setEditing(null);
    } catch {
      showToast({ message: 'Não foi possível guardar. Tenta de novo.' });
    }
  };

  return (
    <>
      <SettingsSection title="Próximos dias">
        {days.map((day, index) => (
          <SettingsRow
            key={day.id}
            first={index === 0}
            title={formatEntryDay(day.day)}
            description="Planeado"
            value={formatDuration(day.plannedMinutes)}
            onPress={() => open(day)}
          />
        ))}
      </SettingsSection>

      <BottomSheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? formatEntryDay(editing.day) : undefined}>
        <DurationField minutes={minutes} onChange={setMinutes} maxHours={10} />
        <View className="gap-1">
          <Button
            disabled={minutes <= 0}
            onPress={() => editing && run(() => monthPlansActions.updateDay(editing.id, minutes))}>
            <Text>Guardar</Text>
          </Button>
          <Button
            variant="ghost"
            className="min-h-12"
            onPress={() => editing && run(() => monthPlansActions.removeDay(editing.id))}>
            <Text className="text-destructive">Tirar este dia do plano</Text>
          </Button>
        </View>
      </BottomSheet>
    </>
  );
}

export { UpcomingDaysList };
