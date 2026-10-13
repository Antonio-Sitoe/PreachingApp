import { useAuthFlow } from '@/hooks/use-auth-flow';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PasswordField, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { getAuthErrorCode, signIn, signInWithGoogle, UNAVAILABLE_MESSAGE } from '@/utils/auth';
import { validateEmail } from '@/utils/auth/validation';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

const NETWORK_MESSAGE = 'Não foi possível ligar. Vê a tua internet e tenta de novo.';

export default function SignInScreen() {
  const { redirect, finish, leave, onboarding, themeVars } = useAuthFlow();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [pending, setPending] = React.useState(false);
  const [wrongCredentials, setWrongCredentials] = React.useState(false);

  const handleError = (error: unknown) => {
    const code = getAuthErrorCode(error);
    if (code === 'invalid-credentials') setWrongCredentials(true);
    else showToast({ message: code === 'unavailable' ? UNAVAILABLE_MESSAGE : NETWORK_MESSAGE });
  };

  const submit = async () => {
    const nextErrors = {
      email: validateEmail(email),
      password: password ? undefined : 'Escreve a tua senha.',
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setPending(true);
    try {
      await signIn(email.trim(), password);
      finish();
    } catch (error) {
      handleError(error);
    } finally {
      setPending(false);
    }
  };

  const google = async () => {
    setPending(true);
    try {
      await signInWithGoogle();
      finish();
    } catch (error) {
      handleError(error);
    } finally {
      setPending(false);
    }
  };

  const continueWithoutAccount = () => {
    if (onboarding) router.replace('/welcome/setup');
    else leave();
  };

  return (
    <SetupLayout
      title="Entrar"
      onBack={leave}
      contentClassName="pt-8"
      footerClassName="items-center gap-1"
      footer={
        <>
          <Button variant="ghost" size="sm" onPress={continueWithoutAccount}>
            <Text className="font-display-semibold text-button">Continuar sem conta</Text>
          </Button>
          <Text variant="bodyS" className="text-center text-muted-foreground">
            A conta serve para backup na nuvem e sincronização. O app funciona todo sem ela.
          </Text>
        </>
      }>
      {redirect}

      <Button
        variant="outline"
        className="border-border bg-card"
        disabled={pending}
        onPress={google}>
        <View className="size-[26px] items-center justify-center rounded-full bg-muted" aria-hidden>
          <Text className="font-display text-[14px] leading-4 text-muted-foreground">G</Text>
        </View>
        <Text className="text-foreground">Continuar com Google</Text>
      </Button>

      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text variant="labelS" className="text-muted-foreground">
          ou com email
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((current) => ({ ...current, email: undefined }));
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

      <View>
        <PasswordField
          label="Senha"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          error={errors.password}
          placeholder="A tua senha"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Link href="/auth/forgot-password" asChild>
          <Button variant="ghost" size="sm" className="self-end px-1">
            <Text>Esqueci-me da senha</Text>
          </Button>
        </Link>
      </View>

      <Button disabled={pending} onPress={submit}>
        <Text>{pending ? 'A entrar…' : 'Entrar'}</Text>
      </Button>

      <View className="flex-row flex-wrap items-center justify-center">
        <Text className="text-muted-foreground">Ainda não tens conta? </Text>
        <Link href="/auth/sign-up" asChild>
          <Text role="link" className="font-sans-semibold text-primary">
            Criar conta
          </Text>
        </Link>
      </View>

      <AlertDialog
        open={wrongCredentials}
        onClose={() => setWrongCredentials(false)}
        themeVars={themeVars}
        icon="alert"
        tone="destructive"
        title="Email ou senha incorrectos"
        description="Confirma os dados e tenta de novo. Se te esqueceste da senha, podes recuperá-la.">
        <Button onPress={() => setWrongCredentials(false)}>
          <Text>Tentar de novo</Text>
        </Button>
        <Button
          variant="ghost"
          className="min-h-12"
          onPress={() => {
            setWrongCredentials(false);
            router.push('/auth/forgot-password');
          }}>
          <Text>Recuperar senha</Text>
        </Button>
      </AlertDialog>
    </SetupLayout>
  );
}
