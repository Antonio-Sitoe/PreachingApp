import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

type EditableTitleProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

function EditableTitle({ value, onValueChange, placeholder = 'Toca para editar' }: EditableTitleProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [editing, value]);

  useEffect(() => {
    if (!editing) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [editing]);

  function confirm() {
    const next = draft.trim();
    setEditing(false);
    if (next !== value) onValueChange(next);
  }

  if (editing) {
    return (
      <TextInput
        ref={inputRef}
        value={draft}
        onChangeText={setDraft}
        onBlur={confirm}
        onSubmitEditing={confirm}
        placeholder={placeholder}
        placeholderTextColor={theme.subtle}
        className="flex-1 font-display-semibold text-[20px] text-foreground"
        autoCorrect={false}
        autoCapitalize="sentences"
        returnKeyType="done"
      />
    );
  }

  return (
    <Text
      variant="titleL"
      className="flex-1 py-1"
      style={!value.trim() ? { opacity: 0.35 } : undefined}
      onPress={() => {
        setDraft(value);
        setEditing(true);
      }}>
      {value.trim() ? value : placeholder}
    </Text>
  );
}

export { EditableTitle };
