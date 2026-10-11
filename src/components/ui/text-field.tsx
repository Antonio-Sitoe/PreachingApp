import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, TextInput, View, type TextInputProps } from 'react-native';

type FieldLabelProps = {
  children: React.ReactNode;
  nativeID?: string;
};

/** Rótulo de um campo de formulário: Red Hat Display Medium 14/19. */
function FieldLabel({ children, nativeID }: FieldLabelProps) {
  return (
    <Text nativeID={nativeID} className="font-display-medium text-[14px] leading-[19px]">
      {children}
    </Text>
  );
}

type FieldErrorProps = {
  children: React.ReactNode;
  nativeID?: string;
};

/** Mensagem de erro de um campo: ícone de alerta e texto a perigo (canvas, "Criar conta, campos com erro"). */
function FieldError({ children, nativeID }: FieldErrorProps) {
  return (
    <View className="flex-row gap-1.5" role="alert">
      <AppIcon name="alert" size={14} className="mt-px text-destructive" />
      <Text nativeID={nativeID} variant="labelS" className="flex-1 text-destructive">
        {children}
      </Text>
    </View>
  );
}

type TextFieldProps = TextInputProps & {
  label: string;
  /** Mensagem de erro por baixo do campo. Também pinta a borda a perigo. */
  error?: string;
  /** Elemento dentro do campo, encostado à direita (44 × 44), por exemplo o botão de mostrar a senha. */
  right?: React.ReactNode;
  /** Classe do contentor (rótulo + campo). */
  containerClassName?: string;
};

/**
 * Campo de texto com rótulo (canvas, artboards "Configuração inicial 1 de 2" e "Criar conta").
 * 52 px de altura, borda de 1 px, cantos de 10 px, texto em Corpo M.
 * Com erro: borda de 1,5 px a perigo e a mensagem por baixo.
 *
 * @example
 * <TextField label="Como preferes ser chamado?" value={nome} onChangeText={setNome} />
 */
function TextField({
  label,
  error,
  right,
  containerClassName,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const id = React.useId();
  const [focused, setFocused] = React.useState(false);

  return (
    <View className={cn('gap-2', containerClassName)}>
      <FieldLabel nativeID={id}>{label}</FieldLabel>
      <View>
        <TextInput
          aria-labelledby={id}
          aria-invalid={error ? true : undefined}
          accessibilityLabel={label}
          placeholderTextColor={THEME.light.subtle}
          className={cn(
            'h-[52px] rounded-lg border border-input bg-card px-4 font-sans text-[14px] text-foreground',
            right && 'pr-[52px]',
            focused && 'border-primary',
            error && 'border-[1.5px] border-destructive',
            Platform.select({ web: 'outline-none' }),
            className
          )}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {right ? <View className="absolute right-1 top-1">{right}</View> : null}
      </View>
      {error ? <FieldError>{error}</FieldError> : null}
    </View>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, 'right' | 'secureTextEntry'> & {
  /** Textos do botão do olho para leitores de ecrã. */
  showLabel?: string;
  hideLabel?: string;
};

/**
 * Campo de senha com o botão do olho para a mostrar ou esconder (canvas, artboard "Entrar").
 *
 * @example
 * <PasswordField label="Senha" value={senha} onChangeText={setSenha} placeholder="A tua senha" />
 */
function PasswordField({
  showLabel = 'Mostrar senha',
  hideLabel = 'Esconder senha',
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      right={
        <Pressable
          role="button"
          accessibilityLabel={visible ? hideLabel : showLabel}
          onPress={() => setVisible((current) => !current)}
          className={cn(
            'size-11 items-center justify-center rounded-full active:bg-secondary',
            Platform.select({ web: 'outline-none focus-visible:bg-secondary' })
          )}>
          <AppIcon name={visible ? 'eye-off' : 'eye'} size={20} className="text-subtle" />
        </Pressable>
      }
      {...props}
    />
  );
}

export { FieldError, FieldLabel, PasswordField, TextField };
export type { PasswordFieldProps, TextFieldProps };
