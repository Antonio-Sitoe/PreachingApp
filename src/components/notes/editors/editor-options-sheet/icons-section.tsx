import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { COVER_CATEGORIES, COVER_ICONS, type CoverIconName } from '@/components/notes/cover-icons';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { cn } from '@/lib/utils';
import { THEME } from '@/lib/theme';
import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

function IconsSection() {
  const coverIcon = useEditorStore((state) => state.coverIcon);
  const id = useEditorStore((state) => state.id);
  const set = useEditorStore((state) => state.set);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [categoryId, setCategoryId] = useState(COVER_CATEGORIES[0].id);
  const category = COVER_CATEGORIES.find((item) => item.id === categoryId) ?? COVER_CATEGORIES[0];

  async function saveIcon(next: CoverIconName | null) {
    set({ coverIcon: next });
    if (!id) return;
    set({ isSaving: true });
    try {
      await notesActions.updateNote(id, { coverIcon: next });
      set({ lastSaved: new Date(), isSaving: false });
    } catch {
      set({ isSaving: false });
      showToast({ message: 'Não foi possível guardar o ícone.' });
    }
  }

  return (
    <View className="gap-3">
      <Text variant="titleS">Ícone de capa</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {COVER_CATEGORIES.map((item) => {
          const selected = item.id === category.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategoryId(item.id)}
              className={cn('rounded-full px-3 py-2', selected ? 'bg-primary' : 'bg-muted')}>
              <Text variant="labelS" className={selected ? 'text-primary-foreground' : 'text-foreground'}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-row flex-wrap gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remover ícone"
          onPress={() => saveIcon(null)}
          className="w-16 items-center gap-1">
          <View
            className={cn(
              'size-12 items-center justify-center rounded-full border',
              coverIcon === null ? 'border-foreground bg-secondary' : 'border-border'
            )}>
            <X size={18} color={theme.subtle} />
          </View>
          <Text variant="labelS" className="text-center text-muted-foreground">
            Remover
          </Text>
        </Pressable>

        {category.icons.map((name) => {
          const selected = coverIcon === name;
          const option = COVER_ICONS[name];
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => saveIcon(name)}
              className="w-16 items-center gap-1">
              <View
                className={cn(
                  'size-12 items-center justify-center rounded-full border',
                  selected ? 'border-foreground bg-secondary' : 'border-border'
                )}>
                <Icon as={option.icon} size={20} className="text-foreground" />
              </View>
              <Text variant="labelS" className="text-center text-muted-foreground" numberOfLines={1}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { IconsSection };
