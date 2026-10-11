import { AppIcon } from '@/components/ui/app-icon';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { asCoverIcon, COVER_ICONS } from '@/components/notes/cover-icons';
import { inkOn } from '@/components/notes/colors';
import { useEditorStore } from '@/components/notes/editors/store';
import { Ellipsis } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

function EditorHeader() {
  const router = useRouter();
  const colorHex = useEditorStore((state) => state.colorHex);
  const tags = useEditorStore((state) => state.tags);
  const coverIcon = useEditorStore((state) => state.coverIcon);
  const set = useEditorStore((state) => state.set);
  const ink = inkOn(colorHex);
  const cover = asCoverIcon(coverIcon);

  return (
    <View className="h-[120px] justify-center overflow-hidden" style={{ backgroundColor: colorHex }}>
      {cover ? (
        <View className="absolute inset-0 items-center justify-center opacity-15">
          <Icon as={COVER_ICONS[cover].icon} size={96} color={ink} />
        </View>
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: `${colorHex}CC` }} />

      <View className="flex-row items-start justify-between px-4 pt-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          className="size-11 items-center justify-center rounded-full bg-black/20">
          <AppIcon name="chevron-left" size={22} className="text-white" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Opções da nota"
          onPress={() => set({ isOptionsBottomSheetOpen: true })}
          className="size-11 items-center justify-center rounded-full bg-black/20">
          <Ellipsis size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {tags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="absolute inset-x-0 bottom-3"
          contentContainerClassName="gap-2 px-4">
          {tags.slice(0, 3).map((tag) => (
            <View key={tag} className="rounded-full bg-white/25 px-3 py-1">
              <Text variant="labelS" className="text-white">
                {tag}
              </Text>
            </View>
          ))}
          {tags.length > 3 ? (
            <View className="rounded-full bg-white/25 px-3 py-1">
              <Text variant="labelS" className="text-white">
                +{tags.length - 3}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
}

export { EditorHeader };
