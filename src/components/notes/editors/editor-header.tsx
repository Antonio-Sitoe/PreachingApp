import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { getInitials } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { isTextBlock } from '@/components/notes/body';
import { formatNoteStamp } from '@/components/notes/format';
import { focusEnd } from '@/components/notes/editors/commands';
import { useSaveNote } from '@/components/notes/editors/save';
import { useEditorStore } from '@/components/notes/editors/store';
import { useTags } from '@/components/notes/tags';
import { STAGES } from '@/constants/stages';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import type { ReactNode } from 'react';
import { Pressable, TextInput, View } from 'react-native';

function DetailRow({
  icon,
  label,
  accessibilityLabel,
  onPress,
  children,
}: {
  icon: AppIconName;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="min-h-11 flex-row items-center gap-2.5">
      <AppIcon name={icon} size={18} className="text-subtle" />
      <Text className="w-[78px] text-[14px] leading-5 text-muted-foreground">{label}</Text>
      {children}
    </Pressable>
  );
}

/** Voltar, estado da gravação e detalhes. Fica fixo por cima do texto. */
function EditorTopBar() {
  const router = useRouter();
  const busy = useEditorStore((state) => state.isSaving || state.isDirty);
  const set = useEditorStore((state) => state.set);

  return (
    <View className="flex-row items-center px-2 pb-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar às notas"
        onPress={() => router.back()}
        className="size-11 items-center justify-center rounded-full active:bg-muted">
        <AppIcon name="chevron-left" size={24} />
      </Pressable>
      <View className="flex-1" />
      <View role="status" className="flex-row items-center gap-1.5 pr-1">
        {busy ? null : <AppIcon name="saved" size={16} className="text-success" />}
        <Text className="text-[13px] leading-[18px] text-muted-foreground">{busy ? 'A guardar…' : 'Guardado'}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Detalhes da nota"
        onPress={() => set({ isDetailsOpen: true })}
        className="size-11 items-center justify-center rounded-full active:bg-muted">
        <AppIcon name="more" size={24} strokeWidth={3} />
      </Pressable>
    </View>
  );
}

/** Título, datas, etiqueta e estudante. Rola com o texto. */
function EditorHeader({ autoFocusTitle }: { autoFocusTitle: boolean }) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const save = useSaveNote();
  const title = useEditorStore((state) => state.title);
  const tagId = useEditorStore((state) => state.tagId);
  const tag = useTags().find((item) => item.id === tagId)?.name ?? null;
  const student = useEditorStore((state) => state.student);
  const createdAt = useEditorStore((state) => state.createdAt);
  const updatedAt = useEditorStore((state) => state.updatedAt);
  const set = useEditorStore((state) => state.set);

  function goToBody() {
    const first = useEditorStore.getState().blocks[0];
    if (isTextBlock(first)) set({ focusedId: first.id, pendingCursor: { id: first.id, position: 0 } });
    else focusEnd();
  }

  return (
    <View>
      <View className="px-5 pt-2">
        <TextInput
          accessibilityLabel="Título da nota"
          value={title}
          onChangeText={(next) => {
            const clean = next.replace(/\n/g, ' ');
            set({ title: clean });
            save({ title: clean });
          }}
          onSubmitEditing={goToBody}
          submitBehavior="submit"
          autoFocus={autoFocusTitle}
          placeholder="Título"
          placeholderTextColor={theme.subtle}
          multiline
          scrollEnabled={false}
          returnKeyType="next"
          autoCapitalize="sentences"
          style={{
            padding: 0,
            fontFamily: 'RedHatDisplay_700Bold',
            fontSize: 26,
            lineHeight: 32,
            letterSpacing: -0.2,
            color: theme.foreground,
          }}
        />

        {createdAt && updatedAt ? (
          <Text className="mt-1.5 text-[13px] leading-[18px] text-muted-foreground">
            {formatNoteStamp(createdAt, updatedAt)}
          </Text>
        ) : null}

        <View className="mt-3">
          <DetailRow
            icon="tag"
            label="Etiqueta"
            accessibilityLabel={tag ? `Etiqueta: ${tag}. Mudar` : 'Escolher etiqueta'}
            onPress={() => set({ isDetailsOpen: true })}>
            {tag ? (
              <View className="h-7 justify-center rounded-full bg-stage-regular-soft px-2.5">
                <Text className="font-display-semibold text-[13px] leading-[18px] text-stage-regular">{tag}</Text>
              </View>
            ) : (
              <Text className="text-[14px] leading-5 text-subtle">Escolher</Text>
            )}
          </DetailRow>
          <DetailRow
            icon="person"
            label="Sobre"
            accessibilityLabel={student ? `Sobre ${student.name}. Mudar` : 'Ligar a nota a um estudante'}
            onPress={() => set({ picker: { kind: 'link' } })}>
            {student ? (
              <View className="flex-1 flex-row items-center gap-2">
                <View
                  className={cn('size-6 items-center justify-center rounded-full', STAGES[student.stage].bgClass)}>
                  <Text className={cn('font-display text-[10px] leading-6', STAGES[student.stage].textClass)}>
                    {getInitials(student.name)}
                  </Text>
                </View>
                <Text variant="titleS" className="flex-1 font-display-medium text-[14px] leading-5" numberOfLines={1}>
                  {student.name}
                </Text>
              </View>
            ) : (
              <Text className="text-[14px] leading-5 text-subtle">Ninguém</Text>
            )}
          </DetailRow>
        </View>

        <View className="mb-4 mt-3 h-px bg-border" />
      </View>
    </View>
  );
}

export { EditorHeader, EditorTopBar };
