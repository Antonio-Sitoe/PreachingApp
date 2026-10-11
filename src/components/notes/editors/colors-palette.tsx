import { Text } from '@/components/ui/text';
import { NOTE_COLORS } from '@/components/notes/colors';
import { useSaveNote } from '@/components/notes/editors/save';
import { useEditorStore } from '@/components/notes/editors/store';
import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';

function ColorsPalette() {
  const color = useEditorStore((state) => state.color);
  const set = useEditorStore((state) => state.set);
  const save = useSaveNote();

  function selectColor(next: string) {
    set({ color: next });
    save({ color: next });
  }

  return (
    <View className="gap-1">
      <Text variant="titleS" className="text-[14px] leading-[19px]">
        Cor na lista
      </Text>
      <View role="radiogroup" aria-label="Cor da nota" className="-ml-1.5 flex-row gap-1">
        {NOTE_COLORS.map((option) => {
          const selected = color === option.color;
          return (
            <Pressable
              key={option.name}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              onPress={() => selectColor(option.color)}
              className="size-11 items-center justify-center">
              <View
                className={cn('size-8 rounded-full', selected ? 'border-[2.5px] border-primary' : 'border border-border')}
                style={{ backgroundColor: option.color }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { ColorsPalette };
