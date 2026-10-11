import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Chamado quando todos os dígitos estão escritos. */
  onComplete?: (value: string) => void;
  /** Número de dígitos. Por omissão 4. */
  length?: number;
  /** Pinta as caixas a perigo (código errado). */
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Nome do campo para leitores de ecrã. */
  label?: string;
};

/**
 * Código de confirmação em caixas (canvas, artboard "Confirmar email").
 * Caixas de 60 × 60 com cantos de 6 px e dígitos em Sen 36; a caixa onde se
 * vai escrever tem a borda da marca. Por baixo há um único campo invisível,
 * por isso colar o código e o preenchimento automático do telemóvel funcionam.
 *
 * @example
 * <CodeInput value={codigo} onChange={setCodigo} onComplete={confirmar} />
 */
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
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        maxLength={length}
        caretHidden
        className={cn(
          'absolute inset-0 text-transparent opacity-0',
          Platform.select({ web: 'outline-none' })
        )}
      />
    </Pressable>
  );
}

export { CodeInput };
export type { CodeInputProps };
