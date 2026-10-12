import {
  changeBody,
  changeTextLength,
  editorRef,
  focusEnd,
  resetTextLength,
} from '@/components/notes/editors/commands';
import { EditorToolbar } from '@/components/notes/editors/editor-toolbar';
import { MentionSuggestions } from '@/components/notes/editors/mention-suggestions';
import { useEditorStore } from '@/components/notes/editors/store';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { EnrichedTextInput, type HtmlStyle, type TextShortcut } from 'react-native-enriched-html';

type Theme = (typeof THEME)['light' | 'dark'];

const TEXT_SHORTCUTS: TextShortcut[] = [
  { trigger: '- ', style: 'unordered_list' },
  { trigger: '1. ', style: 'ordered_list' },
  { trigger: '[] ', style: 'checkbox_list' },
  { trigger: '# ', style: 'h2' },
  { trigger: '> ', style: 'blockquote' },
];

function htmlStyleFor(theme: Theme): HtmlStyle {
  return {
    h2: { fontSize: 19, bold: true },
    blockquote: { borderColor: theme.primary, borderWidth: 3, gapWidth: 12, color: theme.mutedForeground },
    codeblock: { color: theme.foreground, backgroundColor: theme.muted, borderRadius: 8 },
    code: { color: theme.primaryStrong, backgroundColor: theme.muted },
    a: { color: theme.primaryStrong, textDecorationLine: 'underline' },
    ul: { bulletColor: theme.foreground, bulletSize: 6, marginLeft: 4, gapWidth: 12 },
    ol: { markerColor: theme.foreground, marginLeft: 4, gapWidth: 12 },
    ulCheckbox: { boxColor: theme.primary, boxSize: 20, marginLeft: 0, gapWidth: 10 },
    mention: { color: theme.primaryStrong, backgroundColor: theme.secondary, textDecorationLine: 'none' },
  };
}

function EditorDocument({ header }: { header: ReactNode }) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const set = useEditorStore((state) => state.set);
  const [defaultValue] = useState(() => useEditorStore.getState().body);
  const htmlStyle = useMemo(() => htmlStyleFor(theme), [theme]);

  useEffect(() => resetTextLength, []);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" contentContainerClassName="grow pb-4">
        {header}
        <View className="px-5">
          <EnrichedTextInput
            ref={editorRef}
            accessibilityLabel="Texto da nota"
            defaultValue={defaultValue}
            placeholder="Começa a escrever…"
            placeholderTextColor={theme.subtle}
            selectionColor={theme.primary}
            cursorColor={theme.primary}
            scrollEnabled={false}
            textShortcuts={TEXT_SHORTCUTS}
            htmlStyle={htmlStyle}
            style={{
              padding: 0,
              fontFamily: 'Sen_400Regular',
              fontSize: 15,
              lineHeight: 24,
              color: theme.foreground,
            }}
            onChangeHtml={({ nativeEvent }) => changeBody(nativeEvent.value)}
            onChangeText={({ nativeEvent }) => changeTextLength(nativeEvent.value)}
            onChangeState={({ nativeEvent }) => set({ styleState: nativeEvent })}
            onStartMention={() => set({ mention: { query: '' } })}
            onChangeMention={({ text }) => set({ mention: { query: text } })}
            onEndMention={() => set({ mention: null })}
          />
        </View>
        <Pressable accessibilityLabel="Continuar a escrever" onPress={focusEnd} className="min-h-32 grow" />
      </ScrollView>
      <MentionSuggestions />
      <EditorToolbar />
    </View>
  );
}

export { EditorDocument };
