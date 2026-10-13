import { APP_ICONS } from '@/components/ui/app-icon';
import { showToast } from '@/components/ui/toast';
import { toEditorDocument } from '@/components/notes/body';
import { NOTE_COLORS } from '@/components/notes/colors';
import {
  NotesEditorView,
  type NoteMetaField,
  type NotesEditorViewRef,
} from '@/components/notes/editor/native-view';
import { flushNoteSave, saveNote } from '@/components/notes/editor/save';
import { useEditorStore } from '@/components/notes/editor/store';
import { formatNoteStamp } from '@/components/notes/format';
import { TAGS_QUERY_KEY, useTags } from '@/components/notes/tags';
import { STAGES } from '@/constants/stages';
import { TAG_NAME_MAX, TagError, notesActions, tagsActions } from '@/database/actions';
import { SHADOWS, THEME } from '@/lib/theme';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ICONS_JSON = JSON.stringify(APP_ICONS);
const NOTE_COLORS_JSON = JSON.stringify(NOTE_COLORS);

function tagErrorMessage(error: unknown, fallback: string) {
  return error instanceof TagError ? error.message : fallback;
}

function NoteEditor() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const editorRef = useRef<NotesEditorViewRef>(null);
  const leaving = useRef(false);
  const deleted = useRef(false);
  const edited = useRef({ body: false, title: false });
  const [loaded, setLoaded] = useState<{ document: string; title: string } | null>(null);
  const [tagsFeedback, setTagsFeedback] = useState('');
  const tagId = useEditorStore((state) => state.tagId);
  const color = useEditorStore((state) => state.color);
  const studentId = useEditorStore((state) => state.studentId);
  const createdAt = useEditorStore((state) => state.createdAt);
  const updatedAt = useEditorStore((state) => state.updatedAt);
  const busy = useEditorStore((state) => state.isSaving || state.isDirty);
  const tags = useTags();
  const students = useQuery({
    queryKey: ['notes', 'linkable-students'],
    queryFn: notesActions.listLinkableStudents,
  }).data;

  const themeJson = useMemo(
    () => JSON.stringify({ ...THEME[colorScheme ?? 'light'], backdrop: SHADOWS.backdrop }),
    [colorScheme]
  );
  const studentsJson = useMemo(
    () =>
      JSON.stringify(
        (students ?? []).map(({ id, name, stage }) => ({ id, name, stage, detail: STAGES[stage]?.label }))
      ),
    [students]
  );
  const tagsJson = useMemo(() => JSON.stringify(tags.map(({ id, name }) => ({ id, name }))), [tags]);
  const stamp = createdAt && updatedAt ? formatNoteStamp(createdAt, updatedAt) : '';

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
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
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
      const saved = deleted.current ? Promise.resolve() : flushNoteSave();
      useEditorStore.getState().resetEditor();
      if (!noteId) return;
      void saved
        .then(() => (deleted.current ? false : notesActions.deleteIfEmpty(noteId)))
        .catch(() => undefined)
        .then(() => queryClient.invalidateQueries({ queryKey: ['notes'] }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (leaving.current || deleted.current) return;
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

  function changeMeta(field: NoteMetaField, value: string | null) {
    if (field === 'color' && value === null) return;
    useEditorStore.getState().set({ [field]: value });
    saveNote({ [field]: value });
  }

  function linkReference(kind: 'student' | 'tag', referenceId: string) {
    const state = useEditorStore.getState();
    if (kind === 'student' && !state.studentId) changeMeta('studentId', referenceId);
    else if (kind === 'tag' && !state.tagId) changeMeta('tagId', referenceId);
  }

  async function refreshTags() {
    await queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ['notes'] });
  }

  async function createTag(requestId: string, name: string) {
    try {
      const tag = await tagsActions.createTag(name);
      changeMeta('tagId', tag.id);
      await refreshTags();
      setTagsFeedback(JSON.stringify({ requestId, error: null }));
    } catch (error) {
      setTagsFeedback(
        JSON.stringify({ requestId, error: tagErrorMessage(error, 'Não foi possível criar a etiqueta.') })
      );
    }
  }

  async function renameTag(requestId: string, tagIdToRename: string, name: string) {
    try {
      await tagsActions.renameTag(tagIdToRename, name);
      await refreshTags();
      setTagsFeedback(JSON.stringify({ requestId, error: null }));
    } catch (error) {
      setTagsFeedback(JSON.stringify({ requestId, error: tagErrorMessage(error, 'Não foi possível mudar o nome.') }));
    }
  }

  async function deleteTag(tagIdToDelete: string) {
    try {
      await tagsActions.deleteTag(tagIdToDelete);
      if (useEditorStore.getState().tagId === tagIdToDelete) changeMeta('tagId', null);
      await refreshTags();
    } catch {
      showToast({ message: 'Não foi possível apagar a etiqueta.' });
    }
  }

  async function deleteNote() {
    const noteId = useEditorStore.getState().id;
    if (!noteId) return;
    try {
      await flushNoteSave();
      await notesActions.deleteNote(noteId);
      deleted.current = true;
      router.back();
    } catch {
      showToast({ message: 'Não foi possível apagar a nota.' });
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-card">
      {loaded && id ? (
        <NotesEditorView
          ref={editorRef}
          style={{ flex: 1 }}
          documentId={id}
          initialDocument={loaded.document}
          initialTitle={loaded.title}
          placeholder={'Escreve, ou "/" para comandos'}
          theme={themeJson}
          icons={ICONS_JSON}
          noteColors={NOTE_COLORS_JSON}
          students={studentsJson}
          tags={tagsJson}
          tagId={tagId}
          color={color}
          studentId={studentId}
          stamp={stamp}
          saveStatus={busy ? 'saving' : 'saved'}
          tagNameMax={TAG_NAME_MAX}
          tagsFeedback={tagsFeedback}
          onDocumentChange={({ nativeEvent }) => {
            edited.current.body = true;
            saveNote({ body: nativeEvent.document });
          }}
          onTitleChange={({ nativeEvent }) => {
            edited.current.title = true;
            saveNote({ title: nativeEvent.title });
          }}
          onReference={({ nativeEvent }) => linkReference(nativeEvent.kind, nativeEvent.id)}
          onBack={() => router.back()}
          onMetaChange={({ nativeEvent }) => changeMeta(nativeEvent.field, nativeEvent.value)}
          onDeleteNote={() => void deleteNote()}
          onTagCreate={({ nativeEvent }) => void createTag(nativeEvent.requestId, nativeEvent.name)}
          onTagRename={({ nativeEvent }) => void renameTag(nativeEvent.requestId, nativeEvent.id, nativeEvent.name)}
          onTagDelete={({ nativeEvent }) => void deleteTag(nativeEvent.id)}
        />
      ) : null}
    </SafeAreaView>
  );
}

export { NoteEditor };
