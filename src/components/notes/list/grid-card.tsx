import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { inkOn, isColorDark } from '@/components/notes/colors';
import { asCoverIcon, COVER_ICONS } from '@/components/notes/cover-icons';
import { formatNoteDay, formatNoteYear } from '@/components/notes/format';
import { previewText } from '@/components/notes/text';
import type { Note } from '@/database/schemas';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type GridCardProps = {
  note: Note;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function GridCard({ note, isSelecting, isSelected, onPress, onLongPress }: GridCardProps) {
  const ink = inkOn(note.colorHex);
  const muted = isColorDark(note.colorHex) ? 'rgba(255,255,255,0.75)' : 'rgba(30,30,30,0.65)';
  const wash = isColorDark(note.colorHex) ? 'rgba(255,255,255,0.16)' : 'rgba(30,30,30,0.08)';
  const cover = asCoverIcon(note.coverIcon);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      className="mb-3 overflow-hidden rounded-lg p-4 active:opacity-90"
      style={{ backgroundColor: note.colorHex, minHeight: 200, width: '48%' }}>
      {cover ? (
        <View className="absolute -right-3 -top-3 opacity-10">
          <Icon as={COVER_ICONS[cover].icon} size={96} color={ink} />
        </View>
      ) : null}

      <View className="mb-3 flex-row items-start justify-between">
        <View className="size-12 items-center justify-center rounded-lg" style={{ backgroundColor: wash }}>
          <Text className="text-2xl">{note.emoji || '📝'}</Text>
        </View>
        {isSelecting ? (
          <View
            className="size-6 items-center justify-center rounded-full border"
            style={{
              backgroundColor: isSelected ? ink : 'transparent',
              borderColor: ink,
            }}>
            {isSelected ? <Check size={14} color={note.colorHex} /> : null}
          </View>
        ) : null}
      </View>

      <Text variant="titleM" numberOfLines={2} style={{ color: ink }}>
        {note.title || 'Sem título'}
      </Text>
      <Text variant="bodyS" className="mt-2" numberOfLines={4} style={{ color: muted }}>
        {previewText(note.contentHtml, 120)}
      </Text>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="rounded-md px-2 py-1" style={{ backgroundColor: wash }}>
          <Text variant="labelS" style={{ color: ink }}>
            {formatNoteDay(note.updatedAt)}
          </Text>
        </View>
        <Text variant="labelS" style={{ color: muted }}>
          {formatNoteYear(note.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

export { GridCard };
