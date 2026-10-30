import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type SettingsSectionProps = {
  title?: string;

  hint?: string;
  children: ReactNode;
};

function SettingsSection({ title, hint, children }: SettingsSectionProps) {
  return (
    <View className="gap-2">
      {title ? (
        <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
          {title}
        </Text>
      ) : null}
      <View className="overflow-hidden rounded-lg border border-border bg-card">{children}</View>
      {hint ? (
        <Text variant="bodyS" className="px-1 text-muted-foreground">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

type SettingsRowProps = {
  title: string;

  description?: string;

  descriptionTone?: 'default' | 'warning';

  tone?: 'default' | 'primary' | 'danger';

  value?: string;
  onPress?: () => void;

  trailing?: ReactNode;

  chevron?: boolean;
  first?: boolean;
};

function SettingsRow({
  title,
  description,
  descriptionTone = 'default',
  tone = 'default',
  value,
  onPress,
  trailing,
  chevron,
  first,
}: SettingsRowProps) {
  const showChevron = chevron || Boolean(onPress);
  const className = cn(
    'min-h-[52px] flex-row items-center gap-3 py-2',
    showChevron ? 'pl-4 pr-3' : 'px-4',
    !first && 'border-t border-border',
    onPress && 'active:bg-secondary'
  );
  const content = (
    <>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          variant="titleS"
          className={cn(
            tone === 'primary' && 'text-primary',
            tone === 'danger' && 'text-destructive'
          )}>
          {title}
        </Text>
        {description ? (
          <Text
            variant="bodyS"
            className={
              descriptionTone === 'warning'
                ? 'font-sans-semibold text-warning'
                : 'text-muted-foreground'
            }>
            {description}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="bodyM" numberOfLines={1} className="max-w-[46%] text-muted-foreground">
          {value}
        </Text>
      ) : null}
      {trailing}
      {showChevron ? <AppIcon name="chevron-right" size={18} className="text-subtle" /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} className={className}>
        {content}
      </Pressable>
    );
  }

  return <View className={className}>{content}</View>;
}

type SettingsSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label: string;
};

function SettingsSwitch({ value, onValueChange, label }: SettingsSwitchProps) {
  return (
    <Pressable
      role="switch"
      aria-checked={value}
      accessibilityLabel={label}
      onPress={() => onValueChange(!value)}
      className={cn(
        'h-7 w-12 flex-row items-center rounded-full p-0.5',
        value ? 'justify-end bg-primary' : 'justify-start bg-[#8A8F9C]'
      )}>
      <View className="size-6 rounded-full bg-white" />
    </Pressable>
  );
}

export { SettingsRow, SettingsSection, SettingsSwitch };
