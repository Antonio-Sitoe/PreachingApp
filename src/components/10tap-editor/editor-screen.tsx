import { EditorToolbar } from '@/components/10tap-editor/editor-toolbar';
import { InsertSheet } from '@/components/10tap-editor/insert-sheet';
import {
  deleteTentapNoteIfEmpty,
  getTentapNote,
  updateTentapNote,
  type TentapNote,
} from '@/components/10tap-editor/storage';
import { useTentapNote } from '@/components/10tap-editor/use-tentap-note';
import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { THEME } from '@/lib/theme';
import { RichText } from '@10play/tentap-editor';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function TentapNoteEditor() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [note] = useState(() => (id ? getTentapNote(id) : null));

  useEffect(() => {
    if (note) return;
    showToast({ message: 'Esta nota já não existe.' });
    router.back();
  }, [note, router]);

  if (!note) return null;
  return <NoteDocument note={note} />;
}

function NoteDocument({ note }: { note: TentapNote }) {
  const navigation = useNavigation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const { editor, editorState, status, flush } = useTentapNote(note);
  const [title, setTitle] = useState(note.title);
  const [insertOpen, setInsertOpen] = useState(false);
  const leaving = useRef(false);

  // Antes de sair grava o que falta e apaga a nota se ficou vazia.
  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (leaving.current) return;
      event.preventDefault();
      leaving.current = true;
      void flush()
        .catch(() => showToast({ message: 'Não foi possível guardar a nota.' }))
        .finally(() => {
          deleteTentapNoteIfEmpty(note.id);
          navigation.dispatch(event.data.action);
        });
    });
  }, [navigation, flush, note.id]);

  function changeTitle(next: string) {
    const clean = next.replace(/\n/g, ' ');
    setTitle(clean);
    updateTentapNote(note.id, { title: clean });
  }

  const busy = status !== 'saved';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-card">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <View className="flex-row items-center px-2 pb-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar às notas"
            onPress={() => router.back()}
            className="size-11 items-center justify-center rounded-full active:bg-muted">
            <AppIcon name="chevron-left" size={24} />
          </Pressable>
          <View className="flex-1" />
          <View role="status" className="flex-row items-center gap-1.5 pr-3">
            {busy ? null : <AppIcon name="saved" size={16} className="text-success" />}
            <Text className="text-[13px] leading-[18px] text-muted-foreground">{busy ? 'A guardar…' : 'Guardado'}</Text>
          </View>
        </View>

        <View className="px-5 pb-3 pt-2">
          <TextInput
            accessibilityLabel="Título da nota"
            value={title}
            onChangeText={changeTitle}
            onSubmitEditing={() => editor.focus('start')}
            submitBehavior="submit"
            autoFocus={note.title === '' && note.text === ''}
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
          <View className="mt-4 h-px bg-border" />
        </View>

        <View className="flex-1">
          <RichText editor={editor} />
        </View>
        <EditorToolbar editor={editor} state={editorState} onInsert={() => setInsertOpen(true)} />
      </KeyboardAvoidingView>
      <InsertSheet open={insertOpen} editor={editor} onClose={() => setInsertOpen(false)} />
    </SafeAreaView>
  );
}

export { TentapNoteEditor };
