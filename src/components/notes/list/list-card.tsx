import { Text } from '@/components/ui/text';
import { formatNoteDay } from '@/components/notes/format';
import { previewText } from '@/components/notes/text';
import { THEME } from '@/lib/theme';
import type { Note } from '@/database/schemas';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';

type ListCardProps = {
  note: Note;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function ListCard({ note, isSelecting, isSelected, onPress, onLongPress }: ListCardProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      className="mb-3 w-full flex-row items-center rounded-lg bg-card p-4 active:bg-secondary">
      <View
        className="mr-4 size-14 items-center justify-center rounded-lg"
        style={{ backgroundColor: note.colorHex }}>
        <Text className="text-2xl">{note.emoji || '📝'}</Text>
      </View>

      <View className="flex-1 pr-2">
        <Text variant="titleM" numberOfLines={1}>
          {note.title || 'Sem título'}
        </Text>
        <Text variant="bodyS" className="mt-1 text-muted-foreground" numberOfLines={2}>
          {previewText(note.contentHtml, 100)}
        </Text>
        <Text variant="labelS" className="mt-2 text-subtle">
          {formatNoteDay(note.updatedAt)}
        </Text>
      </View>

      {isSelecting ? (
        <View
          className="size-6 items-center justify-center rounded-full border"
          style={{
            backgroundColor: isSelected ? theme.foreground : 'transparent',
            borderColor: theme.foreground,
          }}>
          {isSelected ? <Check size={14} color={theme.background} /> : null}
        </View>
      ) : (
        <View className="size-2 rounded-full" style={{ backgroundColor: note.colorHex }} />
      )}
    </Pressable>
  );
}

export { ListCard };
