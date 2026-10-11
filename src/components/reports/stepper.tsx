import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';

type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

function Stepper({ label, value, onChange, min = 0, max }: StepperProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  return (
    <View className="flex-1 gap-2">
      <Text variant="labelM">{label}</Text>
      <View className="h-12 flex-row items-center justify-between rounded-lg border border-input bg-card px-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${label}`}
          disabled={atMin}
          onPress={() => onChange(Math.max(min, value - 1))}
          className="size-11 items-center justify-center rounded-full active:bg-secondary disabled:opacity-30">
          <Minus size={18} color={theme.foreground} />
        </Pressable>
        <Text variant="titleM">{value}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${label}`}
          disabled={atMax}
          onPress={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
          className="size-11 items-center justify-center rounded-full active:bg-secondary disabled:opacity-30">
          <Plus size={18} color={theme.foreground} />
        </Pressable>
      </View>
    </View>
  );
}

export { Stepper };
