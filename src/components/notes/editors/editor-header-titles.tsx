import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import useTheme from '@/hooks/useTheme';
import { EditableTitle } from './editable-title';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import dayjs from 'dayjs';

function formatDate(date: Date) {
  return dayjs(date).format('DD/MM/YYYY [às] HH:mm');
}

interface EditorHeaderTitlesProps {
  lastSaved: Date;
  emoji?: string;
  onEmojiChange?: (emoji: string) => void;
}

export function EditorHeaderTitles({
  lastSaved,
  emoji = '📝',
  onEmojiChange,
}: EditorHeaderTitlesProps) {
  const [title, setTitle] = useState('📝 Editors');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isDark } = useTheme();

  const handleEmojiSelect = (emojiObject: EmojiType) => {
    onEmojiChange?.(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <View
      className={`px-4 flex-col py-3 border-b ${
        isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <View className="flex-row items-center w-full">
        <TouchableOpacity
          onPress={() => setShowEmojiPicker(true)}
          className={`mr-3 w-10 h-10 rounded-lg justify-center items-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Text className="text-2xl">{emoji}</Text>
        </TouchableOpacity>

        <EditableTitle
          initialValue={title}
          onValueChange={setTitle}
          style={{ fontWeight: '600', marginVertical: 5, flex: 1 }}
          type="title"
          placeholder="Toque para editar..."
        />
      </View>

      <View className="flex-row items-center w-full mt-2">
        {lastSaved && (
          <Text
            className={`text-xs font-medium mt-0.5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            💾 Salvo em {formatDate(lastSaved)}
          </Text>
        )}
      </View>

      <EmojiPicker
        onEmojiSelected={handleEmojiSelect}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
      />
    </View>
  );
}
