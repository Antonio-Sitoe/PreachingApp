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

  error?: string;

  right?: React.ReactNode;

  containerClassName?: string;
};

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

  showLabel?: string;
  hideLabel?: string;
};

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
