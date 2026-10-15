import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;

  onComplete?: (value: string) => void;

  length?: number;

  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;

  label?: string;
};

function CodeInput({
  value,
  onChange,
  onComplete,
  length = 4,
  error = false,
  disabled = false,
  autoFocus = true,
  label = 'Código de confirmação',
}: CodeInputProps) {
  const inputRef = React.useRef<TextInput>(null);
  const [focused, setFocused] = React.useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChange(digits);
    if (digits.length === length && digits !== value) onComplete?.(digits);
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      accessible={false}
      className="flex-row justify-center gap-5">
      {Array.from({ length }, (_, index) => {
        const active = focused && !disabled && index === activeIndex;
        return (
          <View
            key={index}
            className={cn(
              'size-[60px] items-center justify-center rounded-md border border-border bg-card',
              active && 'border-[1.5px] border-primary',
              error && 'border-[1.5px] border-destructive'
            )}>
            <Text className="font-sans text-[36px] leading-[43px]">{value[index] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        autoFocus={autoFocus}
        accessibilityLabel={`${label}, ${length} dígitos`}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        className={'absolute inset-0 text-transparent opacity-0'}
      />
    </Pressable>
  );
}

export { CodeInput };
export type { CodeInputProps };
