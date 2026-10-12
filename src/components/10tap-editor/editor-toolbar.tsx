import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ToolButton({
  label,
  active = false,
  disabled = false,
  onPress,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'size-11 items-center justify-center rounded-lg active:bg-secondary',
        active ? 'bg-secondary' : 'bg-transparent',
        disabled && 'opacity-40'
      )}>
      {children}
    </Pressable>
  );
}

function ToolIcon({ name, active }: { name: AppIconName; active: boolean }) {
  return <AppIcon name={name} size={20} className={active ? 'text-primary-strong' : 'text-muted-foreground'} />;
}

type EditorToolbarProps = {
  editor: EditorBridge;
  state: BridgeState;
  onInsert: () => void;
};

function EditorToolbar({ editor, state, onInsert }: EditorToolbarProps) {
  const insets = useSafeAreaInsets();
  const heading = state.headingLevel === 2;

  return (
    <View
      role="toolbar"
      aria-label="Formatar"
      className="flex-row items-center justify-between border-t border-border bg-card px-3 pt-1.5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <ToolButton label="Inserir" onPress={onInsert}>
        <View className="size-8 items-center justify-center rounded-full bg-primary">
          <AppIcon name="plus" size={18} strokeWidth={2.4} className="text-primary-foreground" />
        </View>
      </ToolButton>
      <ToolButton
        label="Título"
        active={heading}
        disabled={!state.canToggleHeading}
        onPress={() => editor.toggleHeading(2)}>
        <ToolIcon name="heading" active={heading} />
      </ToolButton>
      <ToolButton
        label="Negrito"
        active={state.isBoldActive}
        disabled={!state.canToggleBold}
        onPress={editor.toggleBold}>
        <Text
          className={cn(
            'font-display text-[18px] leading-5',
            state.isBoldActive ? 'text-primary-strong' : 'text-muted-foreground'
          )}>
          B
        </Text>
      </ToolButton>
      <ToolButton
        label="Itálico"
        active={state.isItalicActive}
        disabled={!state.canToggleItalic}
        onPress={editor.toggleItalic}>
        <Text
          className={cn(
            'text-[18px] leading-5',
            state.isItalicActive ? 'text-primary-strong' : 'text-muted-foreground'
          )}
          style={{ fontStyle: 'italic', fontWeight: '600', fontFamily: 'serif' }}>
          I
        </Text>
      </ToolButton>
      <ToolButton
        label="Lista"
        active={state.isBulletListActive}
        disabled={!state.canToggleBulletList}
        onPress={editor.toggleBulletList}>
        <ToolIcon name="bullet-list" active={state.isBulletListActive} />
      </ToolButton>
      <ToolButton
        label="Lista de tarefas"
        active={state.isTaskListActive}
        disabled={!state.canToggleTaskList}
        onPress={editor.toggleTaskList}>
        <ToolIcon name="task-list" active={state.isTaskListActive} />
      </ToolButton>
      <ToolButton
        label="Citação"
        active={state.isBlockquoteActive}
        disabled={!state.canToggleBlockquote}
        onPress={editor.toggleBlockquote}>
        <ToolIcon name="scripture" active={state.isBlockquoteActive} />
      </ToolButton>
      <ToolButton label="Desfazer" disabled={!state.canUndo} onPress={editor.undo}>
        <ToolIcon name="undo" active={false} />
      </ToolButton>
    </View>
  );
}

export { EditorToolbar };
