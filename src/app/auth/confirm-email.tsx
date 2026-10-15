import { useAuthFlow } from '@/hooks/use-auth-flow';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CodeInput } from '@/components/ui/code-input';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import {
  confirmCode,
  getAuthErrorCode,
  resendCode,
  UNAVAILABLE_MESSAGE,
  type CodeFlow,
} from '@/utils/auth';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

const NETWORK_MESSAGE = 'Não foi possível ligar. Vê a tua internet e tenta de novo.';

export default function ConfirmEmailScreen() {
  const params = useLocalSearchParams<{ email?: string; flow?: string }>();
  const email = params.email ?? '';
  const flow: CodeFlow = params.flow === 'reset' ? 'reset' : 'sign-up';

  const { redirect, finish, leave, themeVars } = useAuthFlow();
  const [code, setCode] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [problem, setProblem] = React.useState<'incorrect' | 'expired' | null>(null);

  const confirm = async (value: string) => {
    setPending(true);
    try {
      await confirmCode(email, value, flow);
      if (flow === 'reset') {
        showToast({ message: 'Código certo. Escolher a senha nova ainda não está disponível.' });
        router.dismissTo('/auth/sign-in');
      } else {
        finish();
      }
    } catch (error) {
      const errorCode = getAuthErrorCode(error);
      if (errorCode === 'incorrect-code') setProblem('incorrect');
      else if (errorCode === 'expired-code') setProblem('expired');
      else {
        setCode('');
        showToast({
          message: errorCode === 'unavailable' ? UNAVAILABLE_MESSAGE : NETWORK_MESSAGE,
        });
      }
    } finally {
      setPending(false);
    }
  };

  const resend = async () => {
    setProblem(null);
    setCode('');
    try {
      await resendCode(email, flow);
      showToast({ message: `Enviámos um código novo para ${email}.` });
    } catch (error) {
      showToast({
        message: getAuthErrorCode(error) === 'unavailable' ? UNAVAILABLE_MESSAGE : NETWORK_MESSAGE,
      });
    }
  };

  const tryAgain = () => {
    setProblem(null);
    setCode('');
  };

  return (
    <SetupLayout
      title="Confirmar email"
      onBack={leave}
      contentClassName="items-center gap-[30px] px-6 pt-11"
      footer={
        <Button variant="neutral" onPress={leave}>
          <Text>Cancelar</Text>
        </Button>
      }>
      {redirect}

      <View className="gap-3">
        <Text
          role="heading"
          aria-level="2"
          className="text-center font-sans-semibold text-[22px] leading-[26px]">
          Vê o teu email
        </Text>
        <Text className="text-center text-[15px] leading-5 text-muted-foreground">
          Escreve o código de 4 dígitos que enviámos para{'\n'}
          <Text className="font-sans-semibold text-[15px] leading-5 text-foreground">{email}</Text>
        </Text>
      </View>

      <CodeInput
        value={code}
        onChange={setCode}
        onComplete={confirm}
        error={problem === 'incorrect'}
        disabled={pending || problem !== null}
      />

      <View className="flex-row flex-wrap items-center justify-center">
        <Text className="text-muted-foreground">Não chegou? </Text>
        <Text role="button" onPress={resend} className="font-sans-semibold text-primary">
          Enviar outro código
        </Text>
      </View>

      <AlertDialog
        open={problem === 'incorrect'}
        onClose={tryAgain}
        themeVars={themeVars}
        icon="alert"
        tone="destructive"
        title="Código incorrecto"
        description="O código que escreveste não é o que enviámos. Confirma no email e tenta de novo.">
        <Button onPress={tryAgain}>
          <Text>Tentar de novo</Text>
        </Button>
      </AlertDialog>

      <AlertDialog
        open={problem === 'expired'}
        onClose={tryAgain}
        themeVars={themeVars}
        icon="clock"
        tone="warning"
        title="O código expirou"
        description="Passou demasiado tempo desde que o enviámos. Pede um código novo para continuar.">
        <Button onPress={resend}>
          <Text>Enviar código novo</Text>
        </Button>
        <Button
          variant="ghost"
          className="min-h-12"
          onPress={() => {
            setProblem(null);
            leave();
          }}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </SetupLayout>
  );
}
