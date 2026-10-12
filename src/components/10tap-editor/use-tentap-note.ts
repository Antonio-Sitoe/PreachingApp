import { EDITOR_BASE_CSS, editorThemeCss } from '@/components/10tap-editor/editor-css';
import { updateTentapNote, type TentapNote } from '@/components/10tap-editor/storage';
import { THEME } from '@/lib/theme';
import {
  CoreBridge,
  PlaceholderBridge,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
} from '@10play/tentap-editor';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SAVE_DELAY = 600;
const THEME_CSS_TAG = 'app-theme';

export type SaveStatus = 'saved' | 'pending' | 'saving';

export function useTentapNote(note: TentapNote) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [status, setStatus] = useState<SaveStatus>('saved');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dirty = useRef(false);

  // O useEditorBridge compara pontes e tema por referência: ficam fixos desde a montagem.
  const [bridgeExtensions] = useState(() => [
    ...TenTapStartKit,
    CoreBridge.configureCSS(`${EDITOR_BASE_CSS}\n${editorThemeCss(theme)}`),
    PlaceholderBridge.configureExtension({ placeholder: 'Começa a escrever…' }),
  ]);
  const editorTheme = useMemo(
    () => ({ webview: { backgroundColor: theme.card }, webviewContainer: { backgroundColor: theme.card } }),
    [theme.card]
  );

  const editor = useEditorBridge({
    bridgeExtensions,
    initialContent: note.html,
    avoidIosKeyboard: true,
    theme: editorTheme,
    onChange: () => {
      dirty.current = true;
      setStatus('pending');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), SAVE_DELAY);
    },
  });
  const editorState = useBridgeState(editor);
  // O objecto do editor muda a cada render; os efeitos e o flush lêem sempre o actual.
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
    if (!dirty.current) return;
    dirty.current = false;
    setStatus('saving');
    try {
      const current = editorRef.current;
      const [html, text] = await Promise.all([current.getHTML(), current.getText()]);
      updateTentapNote(note.id, { html, text });
    } finally {
      setStatus(dirty.current ? 'pending' : 'saved');
    }
  }, [note.id]);

  // As cores do tema seguem o claro/escuro da app sem recarregar o editor.
  useEffect(() => {
    if (editorState.isReady) editorRef.current.injectCSS(editorThemeCss(theme), THEME_CSS_TAG);
  }, [editorState.isReady, theme]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { editor, editorState, status, flush };
}
