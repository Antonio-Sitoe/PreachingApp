import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

type StudiesCounterProps = {
  value: number;
  hint?: string | null;
  disabled?: boolean;
  onChange: (value: number) => void;
};

function StudiesCounter({ value, hint, disabled, onChange }: StudiesCounterProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="titleS">Estudos bíblicos</Text>
        {hint ? (
          <Text variant="bodyS" className="text-muted-foreground">
            {hint}
          </Text>
        ) : null}
      </View>
      <View role="group" aria-label="Estudos bíblicos" className="flex-row items-center gap-1">
        <Pressable
          role="button"
          accessibilityLabel="Menos um"
          disabled={disabled || value <= 0}
          onPress={() => onChange(value - 1)}
          className="size-11 items-center justify-center rounded-lg border border-border bg-card active:bg-secondary disabled:opacity-40">
          <AppIcon name="minus" size={20} className="text-foreground" />
        </Pressable>
        <Text className="w-9 text-center font-display text-[20px] leading-[26px]">{value}</Text>
        <Pressable
          role="button"
          accessibilityLabel="Mais um"
          disabled={disabled}
          onPress={() => onChange(value + 1)}
          className="size-11 items-center justify-center rounded-lg border border-border bg-card active:bg-secondary disabled:opacity-40">
          <AppIcon name="plus" size={20} className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}

export { StudiesCounter };
