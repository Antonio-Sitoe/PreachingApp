import { PasswordRules } from '@/components/auth/password-rules';
import { useAuthFlow } from '@/hooks/use-auth-flow';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PasswordField, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { getAuthErrorCode, signUp, UNAVAILABLE_MESSAGE } from '@/utils/auth';
import {
  checkPasswordRules,
  validateEmail,
  validateNewPassword,
  validateRepeatPassword,
} from '@/utils/auth/validation';
import { router } from 'expo-router';
import * as React from 'react';

type Errors = { email?: string; password?: string; repeat?: string };

export default function SignUpScreen() {
  const { leave } = useAuthFlow();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeat, setRepeat] = React.useState('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);

  const hasErrors = Boolean(errors.email || errors.password || errors.repeat);
  const clear = (field: keyof Errors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const submit = async () => {
    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
      repeat: validateRepeatPassword(password, repeat),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.repeat) return;

    setPending(true);
    try {
      await signUp(email.trim(), password);
      router.push({
        pathname: '/auth/confirm-email',
        params: { email: email.trim(), flow: 'sign-up' },
      });
    } catch (error) {
      const code = getAuthErrorCode(error);
      if (code === 'email-in-use') {
        setErrors({ email: 'Já existe uma conta com este email. Experimenta entrar.' });
      } else {
        showToast({
          message:
            code === 'unavailable'
              ? UNAVAILABLE_MESSAGE
              : 'Não foi possível ligar. Vê a tua internet e tenta de novo.',
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <SetupLayout
      title="Criar conta"
      onBack={leave}
      contentClassName="pt-7"
      footerClassName="gap-1"
      footer={
        <>
          <Button disabled={pending} onPress={submit}>
            <Text>{pending ? 'A criar…' : 'Continuar'}</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" onPress={leave}>
            <Text>Cancelar</Text>
          </Button>
        </>
      }>
      <TextField
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clear('email');
        }}
        error={errors.email}
        placeholder="nome@exemplo.com"
        keyboardType="email-address"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />

      <PasswordField
        label="Senha"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clear('password');
        }}
        error={errors.password}
        placeholder="Escolhe uma senha"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />

      <PasswordField
        label="Repetir a senha"
        showLabel="Mostrar senha repetida"
        hideLabel="Esconder senha repetida"
        value={repeat}
        onChangeText={(value) => {
          setRepeat(value);
          clear('repeat');
        }}
        error={errors.repeat}
        placeholder="A mesma senha"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      {hasErrors ? null : <PasswordRules rules={checkPasswordRules(password, repeat)} />}
    </SetupLayout>
  );
}
