import { Pressable, View, Text } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import type { Note } from '@/database/schemas';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '../editors/store';
import { isColorDark } from '@/utils/colors';

interface GridCardProps {
  note: Note;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function GridCard({
  note,
  isSelecting,
  isSelected,
  onPress,
  onLongPress,
}: GridCardProps) {
  const isDark = isColorDark(note.colorHex);
  const textColor = isDark ? '#ffffff' : '#000000';
  const bgOpacity = isDark ? '15' : '20';
  const iconBgOpacity = isDark ? '15' : '25';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      className="mb-4 rounded-3xl p-5 shadow-sm relative overflow-hidden"
      style={{
        backgroundColor: note.colorHex,
        minHeight: 200,
        width: '47%',
        marginHorizontal: '1%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      {note.coverIcon && (
        <View
          className="absolute -top-4 -right-4 opacity-10"
          style={{ zIndex: 0 }}
        >
          <Icon
            name={note.coverIcon as IconName}
            size={100}
            color={textColor}
            className="opacity-80"
          />
        </View>
      )}

      <View className="flex-row items-start justify-between mb-4 relative z-10">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: `${textColor}${iconBgOpacity}` }}
        >
          <Text className="text-2xl">{note.emoji || '📝'}</Text>
        </View>
        {isSelecting ? (
          <View
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: `${textColor}${bgOpacity}` }}
          >
            {isSelected ? (
              <CheckCircle2 size={18} color={textColor} />
            ) : (
              <Circle size={18} color={textColor} />
            )}
          </View>
        ) : (
          <View
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: `${textColor}${bgOpacity}` }}
          />
        )}
      </View>

      <View className="flex-1 justify-between relative z-10">
        <View>
          <Text
            className="font-title text-lg font-bold mb-3 leading-6"
            style={{ color: textColor }}
            numberOfLines={2}
          >
            {note.title || 'Sem título'}
          </Text>
          <Text
            className="font-text text-sm leading-5"
            style={{ color: `${textColor}${isDark ? '85' : '70'}` }}
            numberOfLines={4}
          >
            {note.contentHtml
              ? note.contentHtml
                  .replace(/<[^>]*>/g, ' ')
                  .trim()
                  .substring(0, 120) +
                (note.contentHtml.replace(/<[^>]*>/g, ' ').trim().length > 120
                  ? '...'
                  : '')
              : 'Sem conteúdo'}
          </Text>
        </View>

        {/* Footer com data */}
        <View className="mt-4 flex-row items-center justify-between">
          <View
            className="px-3 py-2 rounded-xl"
            style={{ backgroundColor: `${textColor}${bgOpacity}` }}
          >
            <Text
              className="font-text text-xs font-medium"
              style={{ color: textColor }}
            >
              {new Date(note.updatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: `${textColor}${isDark ? '30' : '40'}` }}
            />
            <Text
              className="font-text text-xs"
              style={{ color: `${textColor}${isDark ? '70' : '60'}` }}
            >
              {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                year: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
