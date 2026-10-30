import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import type { Visit } from '@/database/schemas';
import { cn } from '@/utils/cn';
import { formatVisitSummary, formatVisitTitle, OUTCOME_STYLES } from '@/utils/visits/format';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

type VisitRowProps = {
  visit: Visit;
  first?: boolean;
};

function VisitRow({ visit, first }: VisitRowProps) {
  return (
    <Pressable
      role="button"
      onPress={() => router.push(`/visit/${visit.id}`)}
      className={cn(
        'flex-row items-center gap-3 py-3 pl-4 pr-3 active:bg-secondary',
        !first && 'border-t border-border'
      )}>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="titleS">{formatVisitTitle(visit)}</Text>
        <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
          {formatVisitSummary(visit)}
        </Text>
      </View>
      <OutcomeBadge outcome={visit.outcome} />
      <AppIcon name="chevron-right" size={18} className="text-subtle" />
    </Pressable>
  );
}

function OutcomeBadge({ outcome }: { outcome: Visit['outcome'] }) {
  const style = OUTCOME_STYLES[outcome];
  return (
    <View className={cn('self-start rounded-full px-2 py-[3px]', style.bgClass)}>
      <Text variant="labelS" className={style.textClass}>
        {style.label}
      </Text>
    </View>
  );
}

export { OutcomeBadge, VisitRow };
export type { VisitRowProps };
