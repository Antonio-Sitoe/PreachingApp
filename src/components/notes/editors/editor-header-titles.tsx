import { View, Text } from 'react-native';
import React, { useState } from 'react';
import useTheme from '@/hooks/useTheme';
import { EditableTitle } from './editable-title';
import dayjs from 'dayjs';

function formatDate(date: Date) {
  return dayjs(date).format('DD/MM/YYYY [às] HH:mm');
}

interface EditorHeaderTitlesProps {
  lastSaved: Date;
}

export function EditorHeaderTitles({ lastSaved }: EditorHeaderTitlesProps) {
  const [title, setTitle] = useState('📝 Editors');
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 border-b ${
        isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <View className="flex-1">
        <EditableTitle
          initialValue={title}
          onValueChange={setTitle}
          style={{ fontWeight: '600', marginVertical: 5 }}
          type="title"
          placeholder="Toque para editar..."
        />
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
    </View>
  );
}
