import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import useTheme from '@/hooks/useTheme';
import { EditableTitle } from './editable-title';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEditorStore } from './store';
import { notesActions } from '@/database/actions';
import debounce from 'lodash.debounce';

export function EditorTitle() {
  const backgroundColor = useThemeColor({}, 'background');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isDark } = useTheme();

  const store = useEditorStore();
  const { title, emoji, lastSaved, set, id, isSaving } = store;

  const autoSave = useCallback(
    async (data: { title?: string; emoji?: string }) => {
      if (id) {
        try {
          set({ isSaving: true });
          await notesActions.updateNote(id, data);
          set({ lastSaved: new Date(), isSaving: false });
          console.log('💾 Auto-salvo título/emoji:', data);
        } catch (error) {
          console.error('❌ Erro ao salvar título/emoji:', error);
          set({ isSaving: false });
        }
      }
    },
    [id, set]
  );

  const debouncedSave = useMemo(() => debounce(autoSave, 1500), [autoSave]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      set({ title: newTitle });
      debouncedSave({ title: newTitle });
    },
    [set, debouncedSave]
  );

  const handleEmojiSelect = useCallback(
    (emojiObject: EmojiType) => {
      const newEmoji = emojiObject.emoji;
      set({ emoji: newEmoji });
      setShowEmojiPicker(false);
      debouncedSave({ emoji: newEmoji });
    },
    [set, debouncedSave]
  );

  return (
    <View className={`px-4 flex-col py-3`} style={{ backgroundColor }}>
      <View className="flex-row items-center w-full">
        <TouchableOpacity
          onPress={() => setShowEmojiPicker(true)}
          className={`mr-3 w-14 h-14 rounded-lg justify-center items-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Text className="text-4xl">{emoji}</Text>
        </TouchableOpacity>

        <EditableTitle
          initialValue={title}
          onValueChange={handleTitleChange}
          type="subtitle"
          placeholder="Toque para editar..."
        />
      </View>

      {(lastSaved || isSaving) && (
        <View className="flex-row items-center mt-2">
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{
                backgroundColor: isSaving ? '#f59e0b' : '#10b981',
              }}
            />
            <Text
              className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {isSaving
                ? 'Salvando...'
                : `Salvo automaticamente às ${lastSaved?.toLocaleTimeString(
                    'pt-BR',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}`}
            </Text>
          </View>
        </View>
      )}

      <EmojiPicker
        onEmojiSelected={handleEmojiSelect}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
      />
    </View>
  );
}
