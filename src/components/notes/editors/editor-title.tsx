import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { EditableTitle } from '@/components/notes/editors/editable-title';
import { formatNoteTime } from '@/components/notes/format';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';

function EditorTitle() {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const id = useEditorStore((state) => state.id);
  const title = useEditorStore((state) => state.title);
  const emoji = useEditorStore((state) => state.emoji);
  const lastSaved = useEditorStore((state) => state.lastSaved);
  const isSaving = useEditorStore((state) => state.isSaving);
  const set = useEditorStore((state) => state.set);

  const save = useCallback(
    async (data: { title?: string; emoji?: string }) => {
      if (!id) return;
      set({ isSaving: true });
      try {
        await notesActions.updateNote(id, data);
        set({ lastSaved: new Date(), isSaving: false });
      } catch {
        set({ isSaving: false });
        showToast({ message: 'Não foi possível guardar a nota.' });
      }
    },
    [id, set]
  );

  function onEmojiSelected(emojiObject: EmojiType) {
    set({ emoji: emojiObject.emoji });
    setEmojiOpen(false);
    save({ emoji: emojiObject.emoji });
  }

  return (
    <View className="gap-3 bg-background px-4 py-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escolher emoji"
          onPress={() => setEmojiOpen(true)}
          className="size-14 items-center justify-center rounded-lg bg-muted">
          <Text className="text-4xl">{emoji}</Text>
        </Pressable>
        <EditableTitle
          value={title}
          onValueChange={(next) => {
            set({ title: next });
            save({ title: next });
          }}
        />
      </View>

      {lastSaved || isSaving ? (
        <View className="flex-row items-center gap-2">
          <View className={`size-2 rounded-full ${isSaving ? 'bg-warning' : 'bg-success'}`} />
          <Text variant="bodyS" className="text-muted-foreground">
            {isSaving ? 'A guardar…' : `Guardado às ${lastSaved ? formatNoteTime(lastSaved) : ''}`}
          </Text>
        </View>
      ) : null}

      <EmojiPicker
        onEmojiSelected={onEmojiSelected}
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
      />
    </View>
  );
}

export { EditorTitle };
