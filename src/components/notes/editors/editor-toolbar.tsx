import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { isTextBlock } from '@/components/notes/body';
import {
  insertBlock,
  isInlineActive,
  openMentionPicker,
  setBlockType,
  toggleInline,
} from '@/components/notes/editors/commands';
import { useEditorStore } from '@/components/notes/editors/store';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ToolButton({
  label,
  active = false,
  onPress,
  children,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        'size-11 items-center justify-center rounded-lg active:bg-secondary',
        active ? 'bg-secondary' : 'bg-transparent'
      )}>
      {children}
    </Pressable>
  );
}

function ToolIcon({ name, active }: { name: AppIconName; active: boolean }) {
  return <AppIcon name={name} size={20} className={active ? 'text-primary-strong' : 'text-muted-foreground'} />;
}

function EditorToolbar() {
  const insets = useSafeAreaInsets();
  const set = useEditorStore((state) => state.set);
  const block = useEditorStore((state) => state.blocks.find((item) => item.id === state.focusedId) ?? null);

  useEditorStore((state) => state.selection);
  useEditorStore((state) => state.typingStyles);

  const type = isTextBlock(block) ? block.type : null;
  const bold = isInlineActive(block, 'bold');
  const italic = isInlineActive(block, 'italic');

  return (
    <View
      role="toolbar"
      aria-label="Formatar"
      className="flex-row items-center justify-between border-t border-border bg-card px-3 pt-1.5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <ToolButton label="Inserir bloco" onPress={() => set({ isInsertOpen: true })}>
        <View className="size-8 items-center justify-center rounded-full bg-primary">
          <AppIcon name="plus" size={18} strokeWidth={2.4} className="text-primary-foreground" />
        </View>
      </ToolButton>
      <ToolButton label="Título" active={type === 'heading'} onPress={() => setBlockType('heading')}>
        <ToolIcon name="heading" active={type === 'heading'} />
      </ToolButton>
      <ToolButton label="Negrito" active={bold} onPress={() => toggleInline('bold')}>
        <Text className={cn('font-display text-[18px] leading-5', bold ? 'text-primary-strong' : 'text-muted-foreground')}>
          B
        </Text>
      </ToolButton>
      <ToolButton label="Itálico" active={italic} onPress={() => toggleInline('italic')}>
        <Text
          className={cn('text-[18px] leading-5', italic ? 'text-primary-strong' : 'text-muted-foreground')}
          style={{ fontStyle: 'italic', fontWeight: '600', fontFamily: 'serif' }}>
          I
        </Text>
      </ToolButton>
      <ToolButton label="Lista" active={type === 'bullet'} onPress={() => setBlockType('bullet')}>
        <ToolIcon name="bullet-list" active={type === 'bullet'} />
      </ToolButton>
      <ToolButton label="Lista de tarefas" active={type === 'task'} onPress={() => setBlockType('task')}>
        <ToolIcon name="task-list" active={type === 'task'} />
      </ToolButton>
      <ToolButton label="Texto bíblico" active={block?.type === 'scripture'} onPress={() => insertBlock('scripture')}>
        <ToolIcon name="scripture" active={block?.type === 'scripture'} />
      </ToolButton>
      <ToolButton label="Mencionar estudante" onPress={openMentionPicker}>
        <ToolIcon name="mention" active={false} />
      </ToolButton>
    </View>
  );
}

export { EditorToolbar };
