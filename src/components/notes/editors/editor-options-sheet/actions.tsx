import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { plainText } from '@/components/notes/text';
import { useEditorStore } from '@/components/notes/editors/store';
import { THEME } from '@/lib/theme';
import { Share2, Tag, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, Share, View } from 'react-native';

type ActionsSectionProps = {
  onOpenTags: () => void;
  onAskDelete: () => void;
};

function ActionsSection({ onOpenTags, onAskDelete }: ActionsSectionProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const title = useEditorStore((state) => state.title);
  const content = useEditorStore((state) => state.content);
  const tags = useEditorStore((state) => state.tags);
  const set = useEditorStore((state) => state.set);

  async function shareNote() {
    try {
      const message = `${title}\n\n${plainText(content)}`.trim();
      const result = await Share.share({ message, title: title || 'Nota' });
      if (result.action === Share.sharedAction) set({ isOptionsBottomSheetOpen: false });
    } catch {
      showToast({ message: 'Não foi possível partilhar a nota.' });
    }
  }

  return (
    <View className="gap-3 border-t border-border pt-4">
      <Text variant="titleS">Acções</Text>
      <View className="flex-row gap-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Etiquetas"
          onPress={onOpenTags}
          className="items-center gap-2">
          <View className="size-14 items-center justify-center rounded-lg bg-muted">
            <Tag size={22} color={theme.foreground} />
            {tags.length > 0 ? (
              <View className="absolute -right-1 -top-1 min-w-5 items-center rounded-full bg-foreground px-1">
                <Text variant="labelS" className="text-background">
                  {tags.length}
                </Text>
              </View>
            ) : null}
          </View>
          <Text variant="labelS" className="text-muted-foreground">
            Etiquetas
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Partilhar"
          onPress={shareNote}
          className="items-center gap-2">
          <View className="size-14 items-center justify-center rounded-lg bg-muted">
            <Share2 size={22} color={theme.foreground} />
          </View>
          <Text variant="labelS" className="text-muted-foreground">
            Partilhar
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apagar"
          onPress={onAskDelete}
          className="items-center gap-2">
          <View className="size-14 items-center justify-center rounded-lg bg-destructive-soft">
            <Trash2 size={22} color={theme.destructive} />
          </View>
          <Text variant="labelS" className="text-destructive">
            Apagar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export { ActionsSection };
