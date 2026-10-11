import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { saveNote } from '@/components/notes/editors/save';
import { useEditorStore } from '@/components/notes/editors/store';
import { TAGS_QUERY_KEY, useTags } from '@/components/notes/tags';
import { TAG_NAME_MAX, TagError, tagsActions, type Tag } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof TagError ? error.message : fallback;
}

const inputClass = 'h-12 rounded-lg border border-border bg-card px-3 font-sans text-[14px] text-foreground';

type RowMode = 'view' | 'edit' | 'confirm';

function TagRow({
  tag,
  onRename,
  onDelete,
}: {
  tag: Tag;
  onRename: (name: string) => Promise<string | null>;
  onDelete: () => Promise<void>;
}) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [mode, setMode] = useState<RowMode>('view');
  const [draft, setDraft] = useState(tag.name);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (draft.trim() === tag.name) {
      setMode('view');
      return;
    }
    const problem = await onRename(draft);
    if (problem) setError(problem);
    else setMode('view');
  }

  if (mode === 'edit') {
    return (
      <View className="gap-1.5 border-b border-border py-2">
        <View className="flex-row items-center gap-2">
          <TextInput
            accessibilityLabel={`Novo nome para ${tag.name}`}
            value={draft}
            onChangeText={(value) => {
              setDraft(value);
              setError(null);
            }}
            onSubmitEditing={submit}
            maxLength={TAG_NAME_MAX}
            autoFocus
            returnKeyType="done"
            placeholderTextColor={theme.subtle}
            className={cn(inputClass, 'flex-1')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Guardar nome"
            onPress={submit}
            className="size-11 items-center justify-center rounded-lg bg-primary">
            <AppIcon name="saved" size={20} className="text-primary-foreground" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            onPress={() => {
              setDraft(tag.name);
              setError(null);
              setMode('view');
            }}
            className="size-11 items-center justify-center rounded-lg active:bg-muted">
            <AppIcon name="close" size={20} className="text-muted-foreground" />
          </Pressable>
        </View>
        {error ? (
          <Text variant="bodyS" className="text-destructive">
            {error}
          </Text>
        ) : null}
      </View>
    );
  }

  if (mode === 'confirm') {
    return (
      <View className="gap-2 border-b border-border py-3">
        <Text variant="bodyM">
          Apagar «{tag.name}»? As notas com esta etiqueta ficam sem etiqueta.
        </Text>
        <View className="flex-row gap-2">
          <Button variant="destructive" size="sm" className="flex-1" onPress={onDelete}>
            <Text>Apagar</Text>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onPress={() => setMode('view')}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-14 flex-row items-center gap-1 border-b border-border">
      <Text variant="titleS" className="flex-1" numberOfLines={1}>
        {tag.name}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Renomear ${tag.name}`}
        onPress={() => {
          setDraft(tag.name);
          setMode('edit');
        }}
        className="size-11 items-center justify-center rounded-lg active:bg-muted">
        <AppIcon name="edit" size={18} className="text-muted-foreground" />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Apagar ${tag.name}`}
        onPress={() => setMode('confirm')}
        className="size-11 items-center justify-center rounded-lg active:bg-destructive-soft">
        <AppIcon name="trash" size={18} className="text-destructive" />
      </Pressable>
    </View>
  );
}

function TagsSheet() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const open = useEditorStore((state) => state.isTagsOpen);
  const set = useEditorStore((state) => state.set);
  const queryClient = useQueryClient();
  const tags = useTags();
  const { height } = useWindowDimensions();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft('');
    setError(null);
  }, [open]);

  function close() {
    set({ isTagsOpen: false, isDetailsOpen: true });
  }

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ['notes'] });
  }

  async function create() {
    if (busy) return;
    setBusy(true);
    try {
      const tag = await tagsActions.createTag(draft);
      setDraft('');
      setError(null);

      set({ tagId: tag.id });
      saveNote({ tagId: tag.id });
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause, 'Não foi possível criar a etiqueta.'));
    } finally {
      setBusy(false);
    }
  }

  async function rename(tag: Tag, name: string) {
    try {
      await tagsActions.renameTag(tag.id, name);
      await refresh();
      return null;
    } catch (cause) {
      return errorMessage(cause, 'Não foi possível mudar o nome.');
    }
  }

  async function remove(tag: Tag) {
    try {
      await tagsActions.deleteTag(tag.id);
      if (useEditorStore.getState().tagId === tag.id) {
        set({ tagId: null });
        saveNote({ tagId: null });
      }
      await refresh();
    } catch {
      setError('Não foi possível apagar a etiqueta.');
    }
  }

  const canCreate = draft.trim().length > 0 && !busy;

  return (
    <BottomSheet open={open} onClose={close} title="Etiquetas">
      <View className="gap-1.5">
        <View className="flex-row gap-2">
          <TextInput
            accessibilityLabel="Nome da nova etiqueta"
            value={draft}
            onChangeText={(value) => {
              setDraft(value);
              setError(null);
            }}
            onSubmitEditing={create}
            placeholder="Nova etiqueta"
            placeholderTextColor={theme.subtle}
            maxLength={TAG_NAME_MAX}
            returnKeyType="done"
            className={cn(inputClass, 'flex-1')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Criar etiqueta"
            accessibilityState={{ disabled: !canCreate }}
            onPress={create}
            disabled={!canCreate}
            className={cn('size-12 items-center justify-center rounded-lg bg-primary', !canCreate && 'opacity-50')}>
            <AppIcon name="plus" size={20} className="text-primary-foreground" />
          </Pressable>
        </View>
        {error ? (
          <Text variant="bodyS" className="text-destructive">
            {error}
          </Text>
        ) : null}
      </View>

      <ScrollView style={{ maxHeight: height * 0.4 }} keyboardShouldPersistTaps="handled">
        {tags.length === 0 ? (
          <Text variant="bodyS" className="py-4 text-center text-muted-foreground">
            Ainda não há etiquetas.
          </Text>
        ) : (
          tags.map((tag) => (
            <TagRow key={tag.id} tag={tag} onRename={(name) => rename(tag, name)} onDelete={() => remove(tag)} />
          ))
        )}
      </ScrollView>

      <Button onPress={close}>
        <Text>Concluir</Text>
      </Button>
    </BottomSheet>
  );
}

export { TagsSheet };
