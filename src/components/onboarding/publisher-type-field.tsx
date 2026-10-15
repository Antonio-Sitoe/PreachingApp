import { AppIcon } from '@/components/ui/app-icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radio } from '@/components/ui/option-card';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { PUBLISHER_TYPE_OPTIONS, type PublisherTypeOption } from '@/utils/profile/setup';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

type PublisherTypeFieldProps = {
  label: string;
  value: PublisherTypeOption;
  onChange: (option: PublisherTypeOption) => void;
  options?: readonly PublisherTypeOption[];
  sheetTitle?: string;
  containerClassName?: string;
};

function PublisherTypeField({
  label,
  value,
  onChange,
  options = PUBLISHER_TYPE_OPTIONS,
  sheetTitle = 'Como participas?',
  containerClassName,
}: PublisherTypeFieldProps) {
  const { height } = useWindowDimensions();
  const [open, setOpen] = React.useState(false);

  return (
    <View className={cn('gap-2', containerClassName)}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        role="button"
        accessibilityLabel={`${label}: ${value.label}, ${value.goalLabel}`}
        onPress={() => setOpen(true)}
        className="min-h-[64px] flex-row items-center gap-3 rounded-lg border border-input bg-card px-3 py-2.5 active:bg-secondary">
        <View className="size-11 items-center justify-center rounded-full bg-secondary">
          <AppIcon name={value.icon} size={22} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text variant="titleS" numberOfLines={1}>
            {value.label}
          </Text>
          <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
            {value.description}
          </Text>
        </View>
        <AppIcon name="chevron-down" size={20} className="text-subtle" />
      </Pressable>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <View className="flex-row items-center gap-3">
          <Text variant="titleL" className="flex-1">
            {sheetTitle}
          </Text>
          <IconButton
            variant="ghost"
            icon="close"
            accessibilityLabel="Fechar"
            className="-mr-2.5"
            onPress={() => setOpen(false)}
          />
        </View>
        <ScrollView style={{ maxHeight: height * 0.6 }}>
          <View role="radiogroup" aria-label={sheetTitle} className="gap-2">
            {options.map((option) => {
              const isSelected = option.key === value.key;
              return (
                <Pressable
                  key={option.key}
                  role="radio"
                  aria-checked={isSelected}
                  accessibilityLabel={`${option.label}, ${option.goalLabel}`}
                  onPress={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    'h-[52px] flex-row items-center gap-3 rounded-lg border px-4',
                    isSelected
                      ? 'border-[1.5px] border-primary bg-secondary'
                      : 'border-border active:bg-secondary'
                  )}>
                  <Text variant="titleS" numberOfLines={1} className="flex-1">
                    {option.label}
                  </Text>
                  <Text variant="bodyS" className="text-muted-foreground">
                    {option.goalLabel}
                  </Text>
                  <Radio selected={isSelected} />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

export { PublisherTypeField };
export type { PublisherTypeFieldProps };
