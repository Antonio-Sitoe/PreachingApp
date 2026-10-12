import type { TentapNote } from '@/components/10tap-editor/storage';
import { Text } from '@/components/ui/text';
import { formatNoteDay } from '@/components/notes/format';
import { Pressable } from 'react-native';

type ListCardProps = {
  note: TentapNote;
  onPress: () => void;
  onLongPress: () => void;
};

function ListCard({ note, onPress, onLongPress }: ListCardProps) {
  const title = note.title.trim() || 'Sem título';
  const preview = note.text.replace(/\s+/g, ' ').trim();
  const day = formatNoteDay(note.updatedAt);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${day}`}
      accessibilityHint="Toca sem largar para apagar"
      accessibilityActions={[{ name: 'delete', label: 'Apagar nota' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'delete') onLongPress();
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-3 gap-1.5 rounded-lg border border-border bg-card p-4 active:opacity-80">
      <Text variant="titleM" numberOfLines={2}>
        {title}
      </Text>
      {preview ? (
        <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
          {preview}
        </Text>
      ) : null}
      <Text variant="bodyS" className="text-subtle">
        {day}
      </Text>
    </Pressable>
  );
}

export { ListCard };
