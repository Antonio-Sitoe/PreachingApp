import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { formatDuration } from '@/utils/hours/format';
import { perDay } from '@/utils/hours/plan';
import { View } from 'react-native';

type PlanSummaryCardProps = {
  hasPlan: boolean;
  plannedDaysLeft: number;
  remaining: number;
  daysLeft: number;
  onEdit: () => void;
};

function PlanSummaryCard({
  hasPlan,
  plannedDaysLeft,
  remaining,
  daysLeft,
  onEdit,
}: PlanSummaryCardProps) {
  if (!hasPlan) {
    return (
      <View className="gap-3 rounded-lg border border-border bg-card p-4">
        <View className="gap-1">
          <Text variant="titleS">Plano para cumprir a meta</Text>
          <Text variant="bodyS" className="text-muted-foreground">
            Escolhe os dias em que contas sair e vê quanto tempo precisas em cada um.
          </Text>
        </View>
        <Button variant="outline" onPress={onEdit}>
          <Text>Planear o mês</Text>
        </Button>
      </View>
    );
  }

  const each = perDay(remaining, plannedDaysLeft);
  const everyDay = perDay(remaining, daysLeft);

  return (
    <SettingsSection title="Plano para cumprir a meta">
      <SettingsRow first title="Dias planeados até ao fim do mês" value={String(plannedDaysLeft)} />
      {remaining > 0 && plannedDaysLeft > 0 ? (
        <SettingsRow title="Em cada dia planeado" value={`cerca de ${formatDuration(each)}`} />
      ) : null}
      {remaining > 0 ? (
        <SettingsRow title="Se saíres todos os dias" value={`cerca de ${formatDuration(everyDay)}`} />
      ) : null}
      <SettingsRow title="Mudar o plano" tone="primary" onPress={onEdit} />
    </SettingsSection>
  );
}

export { PlanSummaryCard };
