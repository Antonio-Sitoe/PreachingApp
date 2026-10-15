import { AppIcon } from '@/components/ui/app-icon';
import { Radio } from '@/components/ui/option-card';
import { FieldLabel } from '@/components/ui/text-field';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type SelectOption<Value extends string> = {
  value: Value;
  label: string;
};

type SelectFieldProps<Value extends string> = {
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onChange: (value: Value) => void;

  sheetTitle?: string;
  containerClassName?: string;
};

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
  sheetTitle,
  containerClassName,
}: SelectFieldProps<Value>) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);
  const title = sheetTitle ?? label;

  return (
    <View className={cn('gap-2', containerClassName)}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        role="button"
        accessibilityLabel={`${label}: ${selected?.label ?? ''}`}
        onPress={() => setOpen(true)}
        className="h-[52px] flex-row items-center gap-3 rounded-lg border border-input bg-card pl-4 pr-3 active:bg-secondary">
        <Text variant="titleS" numberOfLines={1} className="flex-1">
          {selected?.label ?? ''}
        </Text>
        <AppIcon name="chevron-down" size={20} className="text-subtle" />
      </Pressable>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={title}>
        <View role="radiogroup" className="gap-2.5">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'h-[52px] flex-row items-center gap-3 rounded-lg border px-4',
                  isSelected
                    ? 'border-[1.5px] border-primary bg-secondary'
                    : 'border-border active:bg-secondary'
                )}>
                <Text variant="titleS" className="flex-1">
                  {option.label}
                </Text>
                <Radio selected={isSelected} />
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

export { SelectField };
export type { SelectFieldProps, SelectOption };
