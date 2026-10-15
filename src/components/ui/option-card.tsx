import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';

type RadioProps = {
  selected: boolean;
  className?: string;
};

function Radio({ selected, className }: RadioProps) {
  return (
    <View
      className={cn(
        'size-5 items-center justify-center rounded-full border-[1.5px]',
        selected ? 'border-primary' : 'border-subtle',
        className
      )}>
      {selected ? <View className="size-2.5 rounded-full bg-primary" /> : null}
    </View>
  );
}

type OptionCardProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  icon: AppIconName;
  title: string;
  description?: string;
  selected: boolean;
};

function OptionCard({ icon, title, description, selected, className, ...props }: OptionCardProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      className={cn(
        'flex-row items-center gap-3.5 rounded-lg border px-4 py-3.5',
        selected
          ? 'border-[1.5px] border-primary bg-secondary'
          : 'border-border bg-card active:bg-secondary',
        className
      )}
      {...props}>
      <View
        className={cn(
          'size-11 shrink-0 items-center justify-center rounded-full',
          selected ? 'bg-card' : 'bg-secondary'
        )}>
        <AppIcon name={icon} size={22} className="text-primary" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="titleS">{title}</Text>
        {description ? (
          <Text variant="bodyS" className="text-muted-foreground">
            {description}
          </Text>
        ) : null}
      </View>
      <Radio selected={selected} />
    </Pressable>
  );
}

export { OptionCard, Radio };
export type { OptionCardProps };
