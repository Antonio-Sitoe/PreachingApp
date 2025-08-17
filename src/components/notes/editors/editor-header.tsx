import Feather from '@expo/vector-icons/build/Feather';
import { useRouter } from 'expo-router';
import {
  TouchableOpacity,
  useColorScheme,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useEditorStore } from './store';
import { Icon } from '@/components/ui/Icon';

export function EditorHeader() {
  const colorScheme = useColorScheme();
  const { back } = useRouter();
  const { colorHex: backgroundColor, tags, set, coverIcon } = useEditorStore();

  return (
    <View
      className="h-[120px] justify-center items-center relative overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
        {coverIcon && (
          <Icon
            name={coverIcon}
            size={100}
            color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
            absoluteFill
          />
        )}
      </View>
      <View
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{
          backgroundColor: `${backgroundColor}CC`,
        }}
      />

      {tags && Array.isArray(tags) && tags.length > 0 && (
        <View className="absolute bottom-3 left-0 right-0 px-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                className="mr-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: '#ffffff' }}
                >
                  {tag}
                </Text>
              </View>
            ))}
            {tags.length > 3 && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: '#ffffff' }}
                >
                  +{tags.length - 3}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      <View className="absolute top-3 left-0 right-0 flex-row justify-between items-start pt-3 px-5">
        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center shadow-lg`}
          style={{
            backgroundColor: `rgba(0,0,0,0.2)`,
          }}
          onPress={() => {
            back();
          }}
        >
          <Feather size={22} color={'#ffffff'} name="chevron-left" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-11 h-11 rounded-full justify-center items-center shadow-lg"
          style={{
            backgroundColor: `rgba(0,0,0,0.2)`,
          }}
          onPress={() => set({ isOptionsBottomSheetOpen: true })}
        >
          <Feather
            size={22}
            color={'#ffffff'}
            name="more-horizontal"
            className="text-white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
