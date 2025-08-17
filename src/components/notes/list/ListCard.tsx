import { Pressable, View, Text } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import useTheme from '@/hooks/useTheme';
import type { Note } from '@/database/schemas';

interface ListCardProps {
  note: Note;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function ListCard({
  note,
  isSelecting,
  isSelected,
  onPress,
  onLongPress,
}: ListCardProps) {
  const { isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      className="mb-3 w-full rounded-2xl p-4 flex-row items-center relative"
      style={{
        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Avatar com emoji */}
      <View
        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
        style={{
          backgroundColor: note.colorHex,
          shadowColor: note.colorHex,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="text-2xl">{note.emoji || '📝'}</Text>
      </View>

      {/* Conteúdo principal */}
      <View className="flex-1 pr-2">
        <View className="mb-2">
          <Text
            className={`font-title text-lg font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            numberOfLines={1}
          >
            {note.title || 'Sem título'}
          </Text>
          <Text
            className={`font-text text-base leading-5 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            numberOfLines={2}
          >
            {note.contentHtml
              ? note.contentHtml
                  .replace(/<[^>]*>/g, ' ')
                  .trim()
                  .substring(0, 100) +
                (note.contentHtml.replace(/<[^>]*>/g, ' ').trim().length > 100
                  ? '...'
                  : '')
              : 'Sem conteúdo'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            className={`font-text text-sm ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {new Date(note.updatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })}
          </Text>
          <View
            className="px-2 py-1 rounded-lg flex-row items-center"
            style={{ backgroundColor: note.colorHex + '15' }}
          >
            <View
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: note.colorHex }}
            />
            <Text
              className="font-text text-sm font-medium"
              style={{ color: note.colorHex }}
            >
              {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                month: 'short',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Indicador de seleção */}
      {isSelecting && (
        <View className="absolute top-3 right-3">
          <View
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{
              backgroundColor: isSelected
                ? isDark
                  ? '#ffffff'
                  : '#000000'
                : 'transparent',
              borderWidth: isSelected ? 0 : 2,
              borderColor: isDark ? '#ffffff' : '#000000',
            }}
          >
            {isSelected ? (
              <CheckCircle2 size={16} color={isDark ? '#000000' : '#ffffff'} />
            ) : (
              <Circle size={16} color={isDark ? '#ffffff' : '#000000'} />
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}
