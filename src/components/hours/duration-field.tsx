import { Stepper } from '@/components/reports/stepper';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { FieldLabel } from '@/components/ui/text-field';
import { View } from 'react-native';

const MINUTE_OPTIONS = [0, 15, 30, 45].map((value) => ({ value, label: `${value} min` }));

type DurationFieldProps = {
  minutes: number;
  onChange: (minutes: number) => void;
  maxHours?: number;
};

function DurationField({ minutes, onChange, maxHours = 12 }: DurationFieldProps) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const quarter = MINUTE_OPTIONS.some((option) => option.value === rest)
    ? rest
    : Math.floor(rest / 15) * 15;

  return (
    <View className="gap-3">
      <View className="flex-row">
        <Stepper
          label="Horas"
          value={hours}
          min={0}
          max={maxHours}
          onChange={(next) => onChange(next * 60 + quarter)}
        />
      </View>
      <View className="gap-2">
        <FieldLabel>Minutos</FieldLabel>
        <SegmentedControl
          accessibilityLabel="Minutos"
          options={MINUTE_OPTIONS}
          value={quarter}
          onChange={(next) => onChange(hours * 60 + next)}
        />
      </View>
    </View>
  );
}

export { DurationField };
