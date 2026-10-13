import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';

type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string | number> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
  className?: string;
};

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  accessibilityLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      role="radiogroup"
      aria-label={accessibilityLabel}
      className={cn('flex-row rounded-lg border border-border bg-muted p-1', className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            role="radio"
            aria-checked={selected}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            className={cn(
              'h-11 flex-1 items-center justify-center rounded-md px-2',
              selected ? 'bg-card' : 'active:opacity-70'
            )}>
            <Text
              numberOfLines={1}
              className={cn(
                'font-display-medium text-[15px] leading-5',
                selected ? 'text-primary-strong' : 'text-muted-foreground'
              )}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedOption };
