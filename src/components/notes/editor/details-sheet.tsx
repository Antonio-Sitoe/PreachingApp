import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ColorsPalette } from '@/components/notes/editor/colors-palette';
import { useSaveNote } from '@/components/notes/editor/save';
import { useEditorStore } from '@/components/notes/editor/store';
import { TagChip } from '@/components/notes/list/tags-filter';
import { useTags } from '@/components/notes/tags';
import { Pressable, ScrollView, View } from 'react-native';

function tagRows<T extends { name: string }>(tags: T[]): T[][] {
  const count = Math.min(3, Math.ceil(tags.length / 3));
  const rows: T[][] = Array.from({ length: count }, () => []);
  const widths = new Array<number>(count).fill(0);
  for (const tag of tags) {
    const shortest = widths.indexOf(Math.min(...widths));
    rows[shortest].push(tag);
    widths[shortest] += tag.name.length + 4;
  }
  return rows;
}

function DetailsSheet() {
  const open = useEditorStore((state) => state.isDetailsOpen);
  const tagId = useEditorStore((state) => state.tagId);
  const set = useEditorStore((state) => state.set);
  const save = useSaveNote();
  const tags = useTags();

  function chooseTag(next: string) {
    const value = tagId === next ? null : next;
    set({ tagId: value });
    save({ tagId: value });
  }

  return (
    <BottomSheet open={open} onClose={() => set({ isDetailsOpen: false })} title="Detalhes da nota">
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text variant="titleS" className="text-[14px] leading-[19px]">
            Etiqueta
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gerir etiquetas"
            hitSlop={8}
            onPress={() => set({ isDetailsOpen: false, isTagsOpen: true })}
            className="h-8 flex-row items-center gap-1.5 rounded-full px-2.5 active:bg-secondary">
            <AppIcon name="edit" size={14} className="text-primary" />
            <Text className="font-display-semibold text-[13px] leading-[18px] text-primary">
              Gerir
            </Text>
          </Pressable>
        </View>
        {tags.length === 0 ? (
          <Text variant="bodyS" className="text-muted-foreground">
            Ainda não há etiquetas. Toca em Gerir para criar.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5"
            contentContainerClassName="gap-2 px-5">
            <View role="radiogroup" aria-label="Etiqueta" className="gap-2">
              {tagRows(tags).map((row, index) => (
                <View key={index} className="flex-row gap-2">
                  {row.map((item) => (
                    <TagChip
                      key={item.id}
                      label={item.name}
                      active={tagId === item.id}
                      onPress={() => chooseTag(item.id)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <ColorsPalette />

      <Button onPress={() => set({ isDetailsOpen: false })}>
        <Text>Concluir</Text>
      </Button>
    </BottomSheet>
  );
}

export { DetailsSheet };
