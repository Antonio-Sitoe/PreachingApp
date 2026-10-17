import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Pressable } from 'react-native';

type ChoiceRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChoiceRow({ label, selected, onPress }: ChoiceRowProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      onPress={onPress}
      className="min-h-[52px] flex-row items-center gap-3 active:opacity-70">
      <Text variant="titleS" className={cn('flex-1', selected && 'text-primary-strong')}>
        {label}
      </Text>
      {selected ? <AppIcon name="check" size={18} className="text-primary" /> : null}
    </Pressable>
  );
}

export { ChoiceRow };
export type { ChoiceRowProps };
