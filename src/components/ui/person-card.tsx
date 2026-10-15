import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import type { Stage } from '@/constants/stages';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';

type Tone = 'default' | 'warning';

type PersonCardProps = {
  name: string;
  stage: Stage;

  detail?: string;

  detailTone?: Tone;

  meta?: string;

  metaTone?: Tone;

  onPress?: () => void;

  onActionPress?: () => void;
  actionLabel?: string;

  showChevron?: boolean;
  className?: string;
};

function PersonCard({
  name,
  stage,
  detail,
  detailTone = 'default',
  meta,
  metaTone = 'default',
  onPress,
  onActionPress,
  actionLabel = 'Marcar como feita ou adiar',
  showChevron,
  className,
}: PersonCardProps) {
  const chevron = !onActionPress && (showChevron ?? Boolean(onPress));

  return (
    <View className={cn('flex-row items-center rounded-lg bg-card py-3.5 pl-4 pr-3', className)}>
      <Pressable
        className={cn('flex-1 flex-row items-center gap-3', onPress && 'active:opacity-70')}
        role={onPress ? 'button' : undefined}
        disabled={!onPress}
        onPress={onPress}>
        <Avatar name={name} />
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row justify-between gap-2">
            <Text variant="titleS" numberOfLines={1} className="shrink">
              {name}
            </Text>
            {meta ? (
              <Text
                className={cn(
                  'font-display-medium text-[12px] leading-5',
                  metaTone === 'warning' ? 'text-warning' : 'text-muted-foreground'
                )}>
                {meta}
              </Text>
            ) : null}
          </View>
          {detail ? (
            <Text
              variant="bodyS"
              numberOfLines={2}
              className={
                detailTone === 'warning'
                  ? 'font-sans-semibold text-warning'
                  : 'text-muted-foreground'
              }>
              {detail}
            </Text>
          ) : null}
          <StageBadge stage={stage} />
        </View>
        {chevron ? <AppIcon name="chevron-right" size={20} className="mr-2 text-subtle" /> : null}
      </Pressable>
      {onActionPress ? (
        <IconButton
          icon="check"
          accessibilityLabel={`${actionLabel}: ${name}`}
          onPress={onActionPress}
          className="ml-3"
        />
      ) : null}
    </View>
  );
}

export { PersonCard };
export type { PersonCardProps };
