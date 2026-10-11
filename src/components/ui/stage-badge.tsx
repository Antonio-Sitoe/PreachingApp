import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { STAGES, type Stage } from '@/constants/stages';
import { cn } from '@/utils/cn';
import { View, type ViewProps } from 'react-native';

type StageBadgeProps = ViewProps & {
  stage: Stage;

  label?: string;
};

function StageBadge({ stage, label, className, ...props }: StageBadgeProps) {
  const config = STAGES[stage];
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 self-start rounded-full px-2 py-[3px]',
        config.bgClass,
        className
      )}
      {...props}>
      {stage === 'paused' && (
        <AppIcon name="pause" size={12} strokeWidth={2.5} className={config.textClass} />
      )}
      <Text variant="labelS" className={config.textClass}>
        {label ?? config.label}
      </Text>
    </View>
  );
}

export { StageBadge };
export type { StageBadgeProps };
