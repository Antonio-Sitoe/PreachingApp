import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import useTheme from '@/hooks/useTheme';
import { EditableTitle } from './editable-title';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEditorStore } from './store';

export function EditorHeaderTitles() {
  const backgroundColor = useThemeColor({}, 'background');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isDark } = useTheme();

  const { title, emoji, lastSaved, setTitle, setEmoji } = useEditorStore();

  const handleEmojiSelect = (emojiObject: EmojiType) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

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
          onValueChange={setTitle}
          style={{ fontWeight: '600', marginVertical: 5, flex: 1 }}
          type="title"
          placeholder="Toque para editar..."
        />
      </View>

      {/* Last saved info */}
      {lastSaved && (
        <View className="flex-row items-center mt-2">
          <Text
            className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            💾 Salvo em {lastSaved.toLocaleString('pt-BR')}
          </Text>
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
