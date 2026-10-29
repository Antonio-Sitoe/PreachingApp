import { Text } from '@/components/ui/text';
import { formatHero, formatHours } from '@/utils/hours/format';
import { View } from 'react-native';

type GoalProgressProps = {
  doneMinutes: number;
  goalHours: number;
  monthName: string;
  daysLeft: number;
};

function GoalProgress({ doneMinutes, goalHours, monthName, daysLeft }: GoalProgressProps) {
  const goalMinutes = goalHours * 60;
  const percent = goalMinutes > 0 ? Math.min(100, Math.round((doneMinutes / goalMinutes) * 100)) : 0;
  const remaining = Math.max(0, goalMinutes - doneMinutes);

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-baseline gap-2">
        <Text className="font-display text-[45px] leading-[48px] text-primary-strong">
          {formatHero(doneMinutes)}
        </Text>
        <Text variant="titleS" className="text-muted-foreground">
          de {formatHours(goalMinutes)} em {monthName}
        </Text>
      </View>
      <View
        role="progressbar"
        aria-label={`${percent}% da meta do mês`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-muted">
        <View className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </View>
      <Text variant="bodyS" className="text-muted-foreground">
        {remaining > 0
          ? `Faltam ${formatHours(remaining)} e ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`
          : 'Meta do mês cumprida'}
      </Text>
    </View>
  );
}

export { GoalProgress };
