import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { toEditorDocument } from '@/components/notes/body';
import { DetailsSheet } from '@/components/notes/editor/details-sheet';
import { NotesEditorView, type NotesEditorViewRef } from '@/components/notes/editor/native-view';
import { flushNoteSave, saveNote } from '@/components/notes/editor/save';
import { useEditorStore } from '@/components/notes/editor/store';
import { TagsSheet } from '@/components/notes/editor/tags-sheet';
import { useTags } from '@/components/notes/tags';
import { STAGES } from '@/constants/stages';
import { notesActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        accessibilityLabel="Etiqueta e cor da nota"
        onPress={() => set({ isDetailsOpen: true })}
        className="size-11 items-center justify-center rounded-full active:bg-muted">
        <AppIcon name="more" size={24} strokeWidth={3} />
      </Pressable>
    </View>
  );
}

function NoteEditor() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const editorRef = useRef<NotesEditorViewRef>(null);
  const leaving = useRef(false);
  const edited = useRef({ body: false, title: false });
  const [loaded, setLoaded] = useState<{ document: string; title: string } | null>(null);
  const tags = useTags();
  const students = useQuery({
    queryKey: ['notes', 'linkable-students'],
    queryFn: notesActions.listLinkableStudents,
  }).data;

  const studentsJson = useMemo(
    () => JSON.stringify((students ?? []).map(({ id, name, stage }) => ({ id, name, detail: STAGES[stage]?.label }))),
    [students]
  );
  const tagsJson = useMemo(() => JSON.stringify(tags.map(({ id, name }) => ({ id, name }))), [tags]);

  useEffect(() => {
    if (!id) return;
    let active = true;

    notesActions
      .getById(id)
      .then((note) => {
        if (!active) return;
        if (!note || note.deletedAt) {
          showToast({ message: 'Esta nota já não existe.' });
          router.back();
          return;
        }
        useEditorStore.getState().set({
          id: note.id,
          tagId: note.tagId,
          color: note.color,
          studentId: note.studentId,
        });
        setLoaded({ document: toEditorDocument(note.body), title: note.title });
      })
      .catch(() => {
        if (!active) return;
        showToast({ message: 'Não foi possível abrir a nota.' });
        router.back();
      });

    return () => {
      active = false;
      const noteId = useEditorStore.getState().id;
      const saved = flushNoteSave();
      useEditorStore.getState().resetEditor();
      if (!noteId) return;
      void saved
        .then(() => notesActions.deleteIfEmpty(noteId))
        .catch(() => undefined)
        .then(() => queryClient.invalidateQueries({ queryKey: ['notes'] }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (leaving.current) return;
      event.preventDefault();
      leaving.current = true;
      const editor = editorRef.current;
      Promise.all([
        edited.current.body ? editor?.getDocument() : null,
        edited.current.title ? editor?.getTitle() : null,
      ])
        .then(([document, title]) => {
          if (document != null) saveNote({ body: document });
          if (title != null) saveNote({ title });
        })
        .catch(() => undefined)
        .then(() => flushNoteSave())
        .finally(() => navigation.dispatch(event.data.action));
    });
  }, [navigation]);

  function linkReference(kind: 'student' | 'tag', referenceId: string) {
    const state = useEditorStore.getState();
    if (kind === 'student' && !state.studentId) {
      state.set({ studentId: referenceId });
      saveNote({ studentId: referenceId });
    } else if (kind === 'tag' && !state.tagId) {
      state.set({ tagId: referenceId });
      saveNote({ tagId: referenceId });
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-card">
      <EditorTopBar />
      {loaded && id ? (
        <NotesEditorView
          ref={editorRef}
          style={{ flex: 1 }}
          documentId={id}
          initialDocument={loaded.document}
          initialTitle={loaded.title}
          placeholder={'Escreve, ou "/" para comandos'}
          students={studentsJson}
          tags={tagsJson}
          foregroundColor={theme.foreground}
          mutedColor={theme.subtle}
          primaryColor={theme.primary}
          surfaceColor={theme.muted}
          cardColor={theme.card}
          dividerColor={theme.border}
          destructiveColor={theme.destructive}
          onDocumentChange={({ nativeEvent }) => {
            edited.current.body = true;
            saveNote({ body: nativeEvent.document });
          }}
          onTitleChange={({ nativeEvent }) => {
            edited.current.title = true;
            saveNote({ title: nativeEvent.title });
          }}
          onReference={({ nativeEvent }) => linkReference(nativeEvent.kind, nativeEvent.id)}
        />
      ) : null}
      <DetailsSheet />
      <TagsSheet />
    </SafeAreaView>
  );
}

export { NoteEditor };
