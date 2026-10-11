import { adjustColorBrightness, inkOn, isColorDark } from '@/components/notes/colors';
import { debounce } from '@/components/notes/editors/debounce';
import { useEditorStore } from '@/components/notes/editors/store';
import { notesActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function EditorRichText() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const richTextRef = useRef<RichEditor>(null);
  const id = useEditorStore((state) => state.id);
  const content = useEditorStore((state) => state.content);
  const colorHex = useEditorStore((state) => state.colorHex);
  const set = useEditorStore((state) => state.set);
  const savedHtml = useRef(content);
  const savedFor = useRef(id);

  if (savedFor.current !== id) {
    savedFor.current = id;
    savedHtml.current = content;
  }

  const ink = inkOn(colorHex);
  const selectedButtonColor = adjustColorBrightness(colorHex, isColorDark(colorHex) ? 36 : -28);

  const debouncedSave = useMemo(
    () =>
      debounce(async (html: string) => {
        const noteId = useEditorStore.getState().id;
        if (!noteId || html === savedHtml.current) return;
        set({ isSaving: true });
        try {
          await notesActions.updateNote(noteId, { contentHtml: html });
          savedHtml.current = html;
          set({ lastSaved: new Date(), isSaving: false, contentHtml: html });
        } catch {
          set({ isSaving: false });
        }
      }, 3000),
    [set]
  );

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  useEffect(() => {
    if (!id) return;
    debouncedSave(content);
  }, [content, debouncedSave, id]);

  return (
    <>
      <View className="flex-1 bg-background">
        <RichEditor
          key={id}
          ref={richTextRef}
          initialContentHTML={content}
          placeholder="Começa a escrever…"
          useContainer={false}
          onChange={(html) => set({ content: html })}
          style={{ flex: 1 }}
          editorStyle={{
            backgroundColor: theme.background,
            color: theme.foreground,
            placeholderColor: theme.subtle,
            cssText: `
              body {
                background-color: ${theme.background};
                color: ${theme.foreground};
                font-size: 16px;
                line-height: 1.5;
                padding: 0 16px;
                margin: 0;
                min-height: 100vh;
              }
              * { box-sizing: border-box; }
            `,
          }}
        />
      </View>
      <RichToolbar
        editor={richTextRef}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading3,
          actions.heading4,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.checkboxList,
        ]}
        iconMap={{
          [actions.heading3]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor, fontWeight: '700' }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor, fontWeight: '700', fontSize: 13 }}>H2</Text>
          ),
        }}
        style={{
          backgroundColor: colorHex,
          marginHorizontal: 16,
          marginBottom: Math.max(insets.bottom, 12),
          borderRadius: 12,
          height: 56,
        }}
        flatContainerStyle={{ paddingHorizontal: 8 }}
        iconTint={ink}
        selectedIconTint={ink}
        selectedButtonStyle={{ backgroundColor: selectedButtonColor, borderRadius: 8 }}
      />
    </>
  );
}

export { EditorRichText };
