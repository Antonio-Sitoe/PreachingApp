import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { format, startMention, type FormatStyle } from '@/components/notes/editors/commands';
import { useEditorStore } from '@/components/notes/editors/store';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { OnChangeStateEvent } from 'react-native-enriched-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StyleKey = Exclude<keyof OnChangeStateEvent, 'alignment'>;

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

function EditorToolbar() {
  const insets = useSafeAreaInsets();
  const set = useEditorStore((state) => state.set);
  const styleState = useEditorStore((state) => state.styleState);

  const active = (key: StyleKey) => styleState?.[key].isActive ?? false;
  const blocked = (key: StyleKey) => styleState?.[key].isBlocking ?? false;

  function styleButton(key: StyleKey, style: FormatStyle) {
    return { active: active(key), disabled: blocked(key), onPress: () => format(style) };
  }

  return (
    <View
      role="toolbar"
      aria-label="Formatar"
      className="flex-row items-center justify-between border-t border-border bg-card px-3 pt-1.5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <ToolButton label="Inserir" onPress={() => set({ isInsertOpen: true })}>
        <View className="size-8 items-center justify-center rounded-full bg-primary">
          <AppIcon name="plus" size={18} strokeWidth={2.4} className="text-primary-foreground" />
        </View>
      </ToolButton>
      <ToolButton label="Título" {...styleButton('h2', 'heading')}>
        <ToolIcon name="heading" active={active('h2')} />
      </ToolButton>
      <ToolButton label="Negrito" {...styleButton('bold', 'bold')}>
        <Text
          className={cn(
            'font-display text-[18px] leading-5',
            active('bold') ? 'text-primary-strong' : 'text-muted-foreground'
          )}>
          B
        </Text>
      </ToolButton>
      <ToolButton label="Itálico" {...styleButton('italic', 'italic')}>
        <Text
          className={cn('text-[18px] leading-5', active('italic') ? 'text-primary-strong' : 'text-muted-foreground')}
          style={{ fontStyle: 'italic', fontWeight: '600', fontFamily: 'serif' }}>
          I
        </Text>
      </ToolButton>
      <ToolButton label="Lista" {...styleButton('unorderedList', 'bullet')}>
        <ToolIcon name="bullet-list" active={active('unorderedList')} />
      </ToolButton>
      <ToolButton label="Lista de tarefas" {...styleButton('checkboxList', 'task')}>
        <ToolIcon name="task-list" active={active('checkboxList')} />
      </ToolButton>
      <ToolButton label="Texto bíblico" {...styleButton('blockQuote', 'quote')}>
        <ToolIcon name="scripture" active={active('blockQuote')} />
      </ToolButton>
      <ToolButton label="Mencionar estudante" disabled={blocked('mention')} onPress={startMention}>
        <ToolIcon name="mention" active={active('mention')} />
      </ToolButton>
    </View>
  );
}

export { EditorToolbar };
