import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

type TagsSheetProps = {
  open: boolean;
  onClose: () => void;
};

function TagsSheet({ open, onClose }: TagsSheetProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const id = useEditorStore((state) => state.id);
  const tags = useEditorStore((state) => state.tags);
  const set = useEditorStore((state) => state.set);
  const [available, setAvailable] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string[]>(tags);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadTags = useCallback(async () => {
    setLoading(true);
    try {
      setAvailable(await notesActions.getTags());
    } catch {
      setAvailable([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelected(useEditorStore.getState().tags);
    setDraft('');
    loadTags();
  }, [loadTags, open]);

  function close() {
    set({ tags: selected });
    onClose();
  }

  async function toggleTag(name: string) {
    if (!id) return;
    const has = selected.includes(name);
    setSelected((current) => (has ? current.filter((tag) => tag !== name) : [...current, name]));
    try {
      if (has) await notesActions.removeTag(id, name);
      else await notesActions.addTag(id, name);
    } catch {
      setSelected((current) => (has ? [...current, name] : current.filter((tag) => tag !== name)));
      showToast({ message: has ? 'Não foi possível remover a etiqueta.' : 'Não foi possível adicionar a etiqueta.' });
    }
  }

  async function addTag() {
    const value = draft.trim().toLowerCase();
    if (!value || !id) return;
    if (available.some((tag) => tag.name === value) || selected.includes(value)) {
      showToast({ message: 'Esta etiqueta já existe.' });
      return;
    }

    setSelected((current) => [...current, value]);
    setDraft('');
    setAdding(true);
    try {
      await notesActions.addTag(id, value);
      await loadTags();
    } catch {
      setSelected((current) => current.filter((tag) => tag !== value));
      showToast({ message: 'Não foi possível criar a etiqueta.' });
    } finally {
      setAdding(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={close} title="Etiquetas">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4" style={{ maxHeight: 420 }}>
        {selected.length > 0 ? (
          <View className="gap-2">
            <Text variant="labelM" className="text-muted-foreground">
              Escolhidas
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selected.map((tag) => (
                <Pressable
                  key={tag}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${tag}`}
                  onPress={() => toggleTag(tag)}
                  className="flex-row items-center gap-1 rounded-full bg-success-soft px-3 py-1">
                  <Text variant="labelS" className="text-success">
                    {tag}
                  </Text>
                  <X size={14} color={theme.success} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View className="gap-2">
          <Text variant="labelM" className="text-muted-foreground">
            Nova etiqueta
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              accessibilityLabel="Nome da etiqueta"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={addTag}
              placeholder="Nome da etiqueta"
              placeholderTextColor={theme.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!adding}
              className="h-12 flex-1 rounded-lg border border-input bg-card px-3 font-sans text-[14px] text-foreground"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar etiqueta"
              onPress={addTag}
              disabled={adding || !draft.trim()}
              className={cn(
                'size-12 items-center justify-center rounded-lg bg-primary',
                (adding || !draft.trim()) && 'opacity-50'
              )}>
              {adding ? (
                <ActivityIndicator color={theme.primaryForeground} />
              ) : (
                <Plus size={18} color={theme.primaryForeground} />
              )}
            </Pressable>
          </View>
        </View>

        <View className="gap-2">
          <Text variant="labelM" className="text-muted-foreground">
            Disponíveis
          </Text>
          {loading ? (
            <View className="flex-row items-center gap-2 py-2">
              <ActivityIndicator color={theme.primary} />
              <Text variant="bodyS" className="text-muted-foreground">
                A carregar etiquetas…
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {available.map((tag) => {
                const chosen = selected.includes(tag.name);
                return (
                  <Pressable
                    key={tag.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: chosen }}
                    onPress={() => toggleTag(tag.name)}
                    className={cn(
                      'rounded-full border px-3 py-2',
                      chosen ? 'border-success bg-success-soft' : 'border-border'
                    )}>
                    <Text variant="labelS" className={chosen ? 'text-success' : 'text-foreground'}>
                      {tag.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <Button onPress={close}>
        <Text>Concluído</Text>
      </Button>
    </BottomSheet>
  );
}

export { TagsSheet };
