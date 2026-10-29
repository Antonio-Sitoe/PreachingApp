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
      className={cn('flex-row gap-1 rounded-lg border border-border bg-muted p-1', className)}>
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
              'h-9 flex-1 items-center justify-center rounded-[7px] px-2',
              selected ? 'bg-card' : 'active:opacity-70'
            )}>
            <Text
              numberOfLines={1}
              className={cn(
                'text-[14px] leading-[18px]',
                selected
                  ? 'font-display-semibold text-primary-strong'
                  : 'font-display-medium text-muted-foreground'
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
