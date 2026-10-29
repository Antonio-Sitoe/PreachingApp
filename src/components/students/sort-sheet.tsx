import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { STUDENT_SORTS, type StudentSort } from '@/constants/students';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';

type SortSheetProps = {
  open: boolean;
  value: StudentSort;
  onSelect: (value: StudentSort) => void;
  onClose: () => void;
};

function SortSheet({ open, value, onSelect, onClose }: SortSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text variant="titleL" className="text-center">
        Ordenar por
      </Text>

      <View role="radiogroup" aria-label="Ordenar por">
        {STUDENT_SORTS.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              role="radio"
              aria-checked={selected}
              onPress={() => onSelect(option.id)}
              className="min-h-[52px] flex-row items-center gap-3 border-t border-border px-1 active:bg-secondary">
              <Text
                className={cn(
                  'flex-1 text-[15px] leading-5',
                  selected
                    ? 'font-display-semibold text-primary-strong'
                    : 'font-display-medium text-foreground'
                )}>
                {option.label}
              </Text>
              {selected ? (
                <AppIcon name="check" size={20} strokeWidth={3} className="text-primary" />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Button variant="ghost" className="min-h-12" onPress={onClose}>
        <Text>Fechar</Text>
      </Button>
    </BottomSheet>
  );
}

export { SortSheet };
export type { SortSheetProps };
