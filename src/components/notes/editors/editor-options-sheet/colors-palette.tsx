import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { NOTE_COLORS, inkOn } from '@/components/notes/colors';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { Check } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

function ColorsPalette() {
  const colorHex = useEditorStore((state) => state.colorHex);
  const id = useEditorStore((state) => state.id);
  const set = useEditorStore((state) => state.set);

  async function selectColor(color: string) {
    set({ colorHex: color });
    if (!id) return;
    set({ isSaving: true });
    try {
      await notesActions.updateNote(id, { colorHex: color });
      set({ lastSaved: new Date(), isSaving: false });
    } catch {
      set({ isSaving: false });
      showToast({ message: 'Não foi possível guardar a cor.' });
    }
  }

  const columns: (typeof NOTE_COLORS)[number][][] = [];
  for (let index = 0; index < NOTE_COLORS.length; index += 2) {
    columns.push(NOTE_COLORS.slice(index, index + 2));
  }

  return (
    <View className="gap-3">
      <Text variant="titleS">Cores</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4">
        {columns.map((column) => (
          <View key={column[0].name} className="gap-3">
            {column.map((option) => {
              const selected = colorHex === option.color;
              return (
                <Pressable
                  key={option.name}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected }}
                  onPress={() => selectColor(option.color)}
                  className="items-center gap-1">
                  <View
                    className="size-12 items-center justify-center rounded-full border-2"
                    style={{
                      backgroundColor: option.color,
                      borderColor: selected ? inkOn(option.color) : 'transparent',
                    }}>
                    {selected ? <Check size={18} color={inkOn(option.color)} /> : null}
                  </View>
                  <Text variant="labelS" className="text-muted-foreground">
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export { ColorsPalette };
