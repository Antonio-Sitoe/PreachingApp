import { AppIcon } from '@/components/ui/app-icon';
import { segments, type Block, type ScriptureBlock, type TextBlock } from '@/components/notes/body';
import {
  backspaceAtStart,
  changeScripture,
  changeText,
  focusEnd,
  removeBlock,
  toggleTask,
} from '@/components/notes/editors/commands';
import { EditorToolbar } from '@/components/notes/editors/editor-toolbar';
import { useEditorStore } from '@/components/notes/editors/store';
import { THEME } from '@/lib/theme';
import { cn } from '@/utils/cn';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, type TextStyle } from 'react-native';

type Theme = (typeof THEME)['light' | 'dark'];

const FONTS = {
  body: 'Sen_400Regular',
  bodyBold: 'Sen_600SemiBold',
  heading: 'RedHatDisplay_700Bold',
};

function baseStyle(block: TextBlock, theme: Theme): TextStyle {
  if (block.type === 'heading') {
    return { fontFamily: FONTS.heading, fontSize: 19, lineHeight: 26, color: theme.foreground };
  }
  const done = block.type === 'task' && block.done;
  return {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 24,
    color: done ? theme.subtle : theme.foreground,
    textDecorationLine: done ? 'line-through' : 'none',
  };
}

function RichSpans({ block, theme }: { block: TextBlock; theme: Theme }) {
  return segments(block.text, block.marks).map((part, index) => {
    const style: TextStyle = {};
    if (part.bold && block.type !== 'heading') style.fontFamily = FONTS.bodyBold;
    if (part.italic) style.fontStyle = 'italic';
    if (part.mention) {
      style.fontFamily = block.type === 'heading' ? FONTS.heading : FONTS.bodyBold;
      style.color = theme.primaryStrong;
      style.backgroundColor = theme.secondary;
    }
    return (
      <Text key={`${index}-${part.text.length}`} style={style}>
        {part.text}
      </Text>
    );
  });
}

function EditorDocument({ header }: { header: ReactNode }) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const set = useEditorStore((state) => state.set);
  const blocks = useEditorStore((state) => state.blocks);
  const focusedId = useEditorStore((state) => state.focusedId);
  const pendingCursor = useEditorStore((state) => state.pendingCursor);
  const inputs = useRef(new Map<string, TextInput>());

  useEffect(() => {
    if (!focusedId) return;
    const input = inputs.current.get(focusedId);
    if (!input) return;
    if (!input.isFocused()) input.focus();
    if (pendingCursor?.id === focusedId) {
      const { position } = pendingCursor;
      set({ pendingCursor: null, selection: { start: position, end: position } });
      requestAnimationFrame(() => input.setSelection(position, position));
    }
  }, [focusedId, pendingCursor, blocks, set]);

  function register(id: string) {
    return (node: TextInput | null) => {
      if (node) inputs.current.set(id, node);
      else inputs.current.delete(id);
    };
  }

  function focus(id: string) {
    if (useEditorStore.getState().focusedId !== id) set({ focusedId: id, typingStyles: {} });
  }

  function trackSelection(id: string, start: number, end: number) {
    if (useEditorStore.getState().focusedId !== id) return;
    set({ selection: { start, end } });
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow pb-4">
        {header}
        <View className="px-5">
        {blocks.map((block) => (
          <BlockRow
            key={block.id}
            block={block}
            theme={theme}
            register={register}
            onFocus={() => focus(block.id)}
            onSelection={(start, end) => trackSelection(block.id, start, end)}
          />
        ))}
        </View>
        <Pressable
          accessibilityLabel="Continuar a escrever"
          onPress={focusEnd}
          className="min-h-32 grow"
        />
      </ScrollView>
      <EditorToolbar />
    </View>
  );
}

type BlockRowProps = {
  block: Block;
  theme: Theme;
  register: (id: string) => (node: TextInput | null) => void;
  onFocus: () => void;
  onSelection: (start: number, end: number) => void;
};

function BlockRow({ block, theme, register, onFocus, onSelection }: BlockRowProps) {
  if (block.type === 'divider') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Separador. Toca sem largar para remover."
        onLongPress={() => removeBlock(block.id)}
        className="py-3">
        <View className="h-px bg-border" />
      </Pressable>
    );
  }

  if (block.type === 'scripture') {
    return (
      <ScriptureRow block={block} theme={theme} register={register} onFocus={onFocus} onSelection={onSelection} />
    );
  }

  const isHeading = block.type === 'heading';

  return (
    <View className={cn('flex-row items-start gap-2.5', isHeading ? 'mb-1.5 mt-2' : 'py-1')}>
      {block.type === 'bullet' ? (
        <Text style={{ fontSize: 15, lineHeight: 24, color: theme.foreground }} aria-hidden>
          •
        </Text>
      ) : null}
      {block.type === 'task' ? <TaskBox done={block.done} onToggle={() => toggleTask(block.id)} /> : null}
      <TextInput
        ref={register(block.id)}
        accessibilityLabel={isHeading ? 'Título da parte' : 'Texto da nota'}
        onChangeText={(value) => changeText(block.id, value)}
        onFocus={onFocus}
        onSelectionChange={({ nativeEvent }) => onSelection(nativeEvent.selection.start, nativeEvent.selection.end)}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === 'Backspace') backspaceAtStart(block.id);
        }}
        placeholder={isHeading ? 'Título da parte' : 'Começa a escrever…'}
        placeholderTextColor={theme.subtle}
        multiline
        scrollEnabled={false}
        style={[{ flex: 1, padding: 0, textAlignVertical: 'top' }, baseStyle(block, theme)]}>
        {block.text.length > 0 ? <RichSpans block={block} theme={theme} /> : null}
      </TextInput>
    </View>
  );
}

function ScriptureRow({
  block,
  theme,
  register,
  onFocus,
  onSelection,
}: Omit<BlockRowProps, 'block'> & { block: ScriptureBlock }) {
  return (
    <View className="my-2 gap-0.5 rounded-r-lg border-l-[3px] border-primary bg-secondary px-3.5 py-2.5">
      <View className="flex-row items-center gap-1.5">
        <AppIcon name="scripture" size={14} className="text-primary-strong" />
        <TextInput
          ref={register(block.id)}
          accessibilityLabel="Referência bíblica"
          value={block.reference}
          onChangeText={(reference) => changeScripture(block.id, { reference })}
          onFocus={onFocus}
          onSelectionChange={({ nativeEvent }) => onSelection(nativeEvent.selection.start, nativeEvent.selection.end)}
          placeholder="Referência, por exemplo Provérbios 15:23"
          placeholderTextColor={theme.subtle}
          style={{
            flex: 1,
            padding: 0,
            fontFamily: 'RedHatDisplay_600SemiBold',
            fontSize: 13,
            lineHeight: 18,
            color: theme.primaryStrong,
          }}
        />
      </View>
      <TextInput
        ref={register(`${block.id}:comment`)}
        accessibilityLabel="O teu comentário"
        value={block.comment}
        onChangeText={(comment) => changeScripture(block.id, { comment })}
        onFocus={onFocus}
        placeholder="O teu comentário"
        placeholderTextColor={theme.subtle}
        multiline
        scrollEnabled={false}
        style={{
          padding: 0,
          fontFamily: FONTS.body,
          fontSize: 14,
          lineHeight: 21,
          color: theme.mutedForeground,
          textAlignVertical: 'top',
        }}
      />
    </View>
  );
}

function TaskBox({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={done ? 'Marcar como por fazer' : 'Marcar como feita'}
      onPress={onToggle}
      hitSlop={10}
      className={cn(
        'mt-0.5 size-5 items-center justify-center rounded-md',
        done ? 'bg-primary' : 'border-[1.5px] border-subtle'
      )}>
      {done ? <AppIcon name="saved" size={14} strokeWidth={3} className="text-primary-foreground" /> : null}
    </Pressable>
  );
}

export { EditorDocument };
