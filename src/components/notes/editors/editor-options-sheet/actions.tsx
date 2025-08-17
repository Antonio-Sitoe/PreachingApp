import { View, Text, Alert, Share, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import useTheme from '@/hooks/useTheme';
import { useEditorStore } from '../store';
import { Tag, Share2, Trash2 } from 'lucide-react-native';
import { TagsModal } from './tags-modal';
import { notesActions } from '@/database/actions';
import { useRouter } from 'expo-router';

export const ActionsSection = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  const { set, content, title, id, resetEditor, tags } = useEditorStore();

  const handleShareAsText = async () => {
    try {
      const cleanContent = content.replace(/<[^>]*>/g, '');
      const shareText = `${title}\n\n${cleanContent}`;

      const result = await Share.share({
        message: shareText,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        set({ isOptionsBottomSheetOpen: false });
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível partilhar como texto');
    }
  };

  const handleDeleteNote = () => {
    if (!id) {
      Alert.alert('Erro', 'Não é possível eliminar uma anotação sem ID.');
      return;
    }
    Alert.alert(
      'Eliminar Anotação',
      'Tem certeza que deseja eliminar esta anotação? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              set({ isOptionsBottomSheetOpen: false });
              await notesActions.deleteNote(id, true);
              resetEditor();
              router.back();
            } catch (error) {
              console.error('❌ Erro ao eliminar nota:', error);
            }
          },
        },
      ]
    );
  };

  const handleOpenTagsModal = () => {
    setIsTagsModalOpen(true);
  };

  return (
    <View
      className="border-t pt-6"
      style={{
        borderTopColor: isDark ? '#374151' : '#e5e7eb',
      }}
    >
      <Text
        className={`text-lg font-medium font-title mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Ações
      </Text>

      <View className="flex-row justify-start gap-6">
        {/* Tags Button */}
        <TouchableOpacity
          onPress={handleOpenTagsModal}
          className="items-center"
        >
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-2 relative"
            style={{
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
            }}
          >
            <Tag size={24} color={isDark ? '#ffffff' : '#000000'} />
            {tags.length > 0 && (
              <View
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isDark ? '#22c55e' : '#16a34a',
                }}
              >
                <Text className="text-white text-xs font-bold">
                  {tags.length}
                </Text>
              </View>
            )}
          </View>
          <Text
            className={`text-sm font-medium font-subTitle ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Etiquetas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShareAsText} className="items-center">
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
            style={{
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
            }}
          >
            <Share2 size={24} color={isDark ? '#ffffff' : '#000000'} />
          </View>
          <Text
            className={`text-sm font-medium font-subTitle ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Partilhar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteNote} className="items-center">
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
            style={{
              backgroundColor: isDark ? '#7f1d1d' : '#fef2f2',
            }}
          >
            <Trash2 size={24} color={isDark ? '#ff6b6b' : '#dc2626'} />
          </View>
          <Text
            className={`text-sm font-medium font-subTitle ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
      />
    </View>
  );
};
