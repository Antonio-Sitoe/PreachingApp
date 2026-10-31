import { View } from 'react-native';

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
};

function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 overflow-hidden rounded-full bg-muted">
      <View className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
    </View>
  );
}

export { ProgressBar };
export type { ProgressBarProps };
