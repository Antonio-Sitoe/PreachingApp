import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { monthPlansActions, type MonthPlanWithDays } from '@/database/actions';
import type { PublisherType } from '@/database/schemas';
import { formatDuration, formatHours, formatMonthName } from '@/utils/hours/format';
import { WEEKDAYS, WEEKDAY_SHORT, parseWeekdays, planDates, planSummary } from '@/utils/hours/plan';
import { cn } from '@/utils/cn';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { DurationField } from './duration-field';

type PlanSheetProps = {
  open: boolean;
  onClose: () => void;
  year: number;
  month: number;
  publisherType: PublisherType;
  hourGoal: number;
  remaining: number;
  plan: MonthPlanWithDays | null;
};

function PlanSheet({
  open,
  onClose,
  year,
  month,
  publisherType,
  hourGoal,
  remaining,
  plan,
}: PlanSheetProps) {
  const queryClient = useQueryClient();
  const [weekdays, setWeekdays] = React.useState<number[]>([]);
  const [minutesPerDay, setMinutesPerDay] = React.useState(120);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setWeekdays(plan ? parseWeekdays(plan.weekdays) : []);
    setMinutesPerDay(plan?.minutesPerDay || 120);
  }, [open, plan]);

  const days = planDates(year, month, weekdays).length;

  const toggle = (day: number) =>
    setWeekdays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day]
    );

  const save = async () => {
    setSaving(true);
    try {
      monthPlansActions.save({ year, month, publisherType, hourGoal, weekdays, minutesPerDay });
      await queryClient.invalidateQueries({ queryKey: ['month-plans'] });
      onClose();
    } catch {
      showToast({ message: 'Não foi possível guardar o plano. Tenta de novo.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View className="gap-1">
        <Text variant="titleL">Plano de {formatMonthName(year, month)}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {remaining > 0
            ? `Faltam ${formatDuration(remaining)} para a meta de ${formatHours(hourGoal * 60)}`
            : `A meta de ${formatHours(hourGoal * 60)} já está cumprida`}
        </Text>
      </View>

      <View className="gap-2">
        <FieldLabel>Em que dias costumas sair?</FieldLabel>
        <View role="group" aria-label="Dias da semana" className="flex-row gap-1.5">
          {WEEKDAYS.map((day) => {
            const selected = weekdays.includes(day);
            return (
              <Pressable
                key={day}
                role="checkbox"
                aria-checked={selected}
                accessibilityLabel={WEEKDAY_SHORT[day]}
                onPress={() => toggle(day)}
                className={cn(
                  'h-11 flex-1 items-center justify-center rounded-lg border',
                  selected ? 'border-primary bg-primary' : 'border-border bg-card active:bg-secondary'
                )}>
                <Text
                  variant="labelS"
                  className={selected ? 'text-primary-foreground' : 'text-foreground'}>
                  {WEEKDAY_SHORT[day]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-1">
        <Text variant="labelM">Horas por dia</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          Podes acertar cada dia depois
        </Text>
      </View>
      <DurationField minutes={minutesPerDay} onChange={setMinutesPerDay} maxHours={10} />

      <View className="rounded-lg bg-secondary p-4">
        <Text variant="bodyS" className="text-primary-strong">
          {planSummary(days, minutesPerDay, remaining)}
        </Text>
      </View>

      <View className="gap-1">
        <Button disabled={saving || minutesPerDay <= 0} onPress={save}>
          <Text>Guardar plano</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>
    </BottomSheet>
  );
}

export { PlanSheet };
