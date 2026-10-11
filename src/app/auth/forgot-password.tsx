import { useAuthFlow } from '@/hooks/use-auth-flow';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { getAuthErrorCode, requestPasswordReset, UNAVAILABLE_MESSAGE } from '@/utils/auth';
import { validateEmail } from '@/utils/auth/validation';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

/** Recuperar senha (canvas, artboard "Recuperar senha"). */
export default function ForgotPasswordScreen() {
  const { leave } = useAuthFlow();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);

  const submit = async () => {
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setPending(true);
    try {
      await requestPasswordReset(email.trim());
      router.push({
        pathname: '/auth/confirm-email',
        params: { email: email.trim(), flow: 'reset' },
      });
    } catch (caught) {
      showToast({
        message:
          getAuthErrorCode(caught) === 'unavailable'
            ? UNAVAILABLE_MESSAGE
            : 'Não foi possível ligar. Vê a tua internet e tenta de novo.',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <SetupLayout
      title="Recuperar senha"
      onBack={leave}
      contentClassName="pt-5"
      footerClassName="gap-2"
      footer={
        <>
          <Button disabled={pending} onPress={submit}>
            <Text>{pending ? 'A enviar…' : 'Enviar código'}</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" onPress={leave}>
            <Text>Cancelar</Text>
          </Button>
        </>
      }>
      <View className="gap-2">
        <Text
          role="heading"
          aria-level="2"
          className="font-sans-semibold text-[22px] leading-[26px]">
          Esqueceste-te da senha?
        </Text>
        <Text className="text-[15px] leading-5 text-muted-foreground">
          Escreve o email da conta. Enviamos um código de 4 dígitos para escolheres uma senha nova.
        </Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError(undefined);
        }}
        error={error}
        placeholder="nome@exemplo.com"
        keyboardType="email-address"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
      />

      <Text className="px-1 text-[13px] leading-[18px] text-muted-foreground">
        Os dados do telemóvel não mudam: a senha só serve para a cópia na nuvem e a sincronização.
      </Text>
    </SetupLayout>
  );
}
