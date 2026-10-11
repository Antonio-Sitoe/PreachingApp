import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { NOTE_INK, NOTE_INK_MUTED } from '@/components/notes/colors';
import { formatNoteDay } from '@/components/notes/format';
import type { NoteListItem } from '@/database/actions';
import { useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

type ListCardProps = {
  note: NoteListItem;
  onPress: () => void;

  onDelete: (close: () => void) => void;

  onOpen: (close: () => void) => void;
};

function ListCard({ note, onPress, onDelete, onOpen }: ListCardProps) {
  const swipeable = useRef<SwipeableMethods>(null);
  const open = useRef(false);
  const day = formatNoteDay(note.createdAt);
  const meta = note.tagName ? `${note.tagName} · ${day}` : day;
  const title = note.title.trim() || 'Sem título';

  const close = () => swipeable.current?.close();

  const deleteRef = useRef(onDelete);
  deleteRef.current = onDelete;
  const deleteTap = useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .onEnd((_event, success) => {
          if (success) deleteRef.current(() => swipeable.current?.close());
        }),
    []
  );

  return (
    <ReanimatedSwipeable
      ref={swipeable}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      requireExternalGestureToFail={deleteTap}
      containerStyle={{ marginBottom: 12 }}
      onSwipeableWillOpen={() => {
        open.current = true;
        onOpen(close);
      }}
      onSwipeableWillClose={() => {
        open.current = false;
      }}
      renderRightActions={() => (
        <GestureDetector gesture={deleteTap}>
          <View
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Apagar ${title}`}
            onAccessibilityTap={() => onDelete(close)}
            className="ml-2 w-[88px] items-center justify-center gap-1 rounded-lg bg-destructive">
            <AppIcon name="trash" size={20} className="text-destructive-foreground" />
            <Text variant="labelS" className="text-destructive-foreground">
              Apagar
            </Text>
          </View>
        </GestureDetector>
      )}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${meta}`}
        accessibilityActions={[{ name: 'delete', label: 'Apagar nota' }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'delete') onDelete(close);
        }}
        onPress={() => {

          if (open.current) close();
          else onPress();
        }}
        className="gap-2.5 rounded-lg border border-border p-4 active:opacity-80"
        style={{ backgroundColor: note.color }}>
        <Text variant="titleM" numberOfLines={2} style={{ color: NOTE_INK }}>
          {title}
        </Text>
        <Text variant="bodyS" style={{ color: NOTE_INK_MUTED }}>
          {meta}
        </Text>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

export { ListCard };
