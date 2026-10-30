import { Logo } from '@/components/brand/logo';
import { PinPad } from '@/components/lock/pin-pad';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { disableLock, savePin, verifyPin } from '@/utils/lock';
import { authenticate, canUseBiometrics } from '@/utils/lock/biometric';
import { setBiometricEnabled, setLockEnabled } from '@/utils/storage';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Mode = 'create' | 'change' | 'disable';
type Step = 'current' | 'choose' | 'repeat' | 'biometric';

// Aberto por deep link não há para onde voltar: vai para Gerais.
function leave() {
  if (router.canGoBack()) router.back();
  else router.replace('/general');
}

const TITLES: Record<Exclude<Step, 'biometric'>, { title: string; hint: string }> = {
  current: { title: 'Escreve o PIN actual', hint: 'Para confirmar que és tu.' },
  choose: { title: 'Escolhe um PIN', hint: '4 dígitos. Vais usá-lo sempre que abrires o app.' },
  repeat: { title: 'Repete o PIN', hint: 'Escreve os mesmos 4 dígitos.' },
};

export default function LockSetupScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const mode: Mode = params.mode === 'change' || params.mode === 'disable' ? params.mode : 'create';
  const [step, setStep] = React.useState<Step>(mode === 'create' ? 'choose' : 'current');
  const [chosen, setChosen] = React.useState('');
  const [errorKey, setErrorKey] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const fail = (message: string) => {
    setError(message);
    setErrorKey((key) => key + 1);
  };

  const finish = (message: string) => {
    showToast({ message });
    leave();
  };

  const onPin = async (pin: string) => {
    setBusy(true);
    try {
      if (step === 'current') {
        if (!(await verifyPin(pin))) return fail('PIN errado. Tenta de novo.');
        setError(null);
        setErrorKey(0);
        if (mode === 'disable') {
          await disableLock();
          return finish('Bloqueio desligado');
        }
        setStep('choose');
        return;
      }
      if (step === 'choose') {
        setChosen(pin);
        setError(null);
        setErrorKey(0);
        setStep('repeat');
        return;
      }
      if (pin !== chosen) {
        setChosen('');
        setStep('choose');
        return fail('Os PINs não são iguais. Escolhe de novo.');
      }
      await savePin(pin);
      setLockEnabled(true);
      if (mode === 'create' && (await canUseBiometrics())) {
        setStep('biometric');
        return;
      }
      finish(mode === 'change' ? 'PIN alterado' : 'Bloqueio ligado');
    } catch {
      fail('Não foi possível guardar o PIN. Tenta de novo.');
    } finally {
      setBusy(false);
    }
  };

  const enableBiometric = async () => {
    if (await authenticate()) {
      setBiometricEnabled(true);
      finish('Bloqueio ligado com impressão digital');
    }
  };

  if (step === 'biometric') {
    return (
      <View
        className="flex-1 items-center gap-7 bg-background px-6"
        style={{ paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 }}>
        <Logo width={120} />
        <View className="items-center gap-2">
          <Text variant="titleXl" className="text-center">
            PIN criado
          </Text>
          <Text variant="bodyM" className="text-center text-muted-foreground">
            Podes mudá-lo em Mais, Gerais.
          </Text>
        </View>
        <View className="mt-auto w-full max-w-[400px] gap-4 rounded-lg border border-border bg-card p-5">
          <View className="gap-1">
            <Text variant="titleM">Entrar com a impressão digital?</Text>
            <Text variant="bodyS" className="text-muted-foreground">
              Mais rápido do que o PIN. O PIN continua a funcionar se a leitura falhar.
            </Text>
          </View>
          <View className="gap-1">
            <Button onPress={() => void enableBiometric()}>
              <Text>Activar</Text>
            </Button>
            <Button variant="ghost" className="min-h-12" onPress={() => finish('Bloqueio ligado')}>
              <Text>Usar só o PIN</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  const copy = TITLES[step];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={mode === 'disable' ? 'Desligar bloqueio' : mode === 'change' ? 'Alterar PIN' : 'Bloqueio do app'}
        onBack={leave}
      />
      <View
        className="w-full max-w-[400px] flex-1 items-center gap-7 self-center px-6 pt-10"
        style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="items-center gap-2">
          <Text variant="titleXl" className="text-center">
            {copy.title}
          </Text>
          <Text
            variant="bodyM"
            role={error ? 'alert' : undefined}
            className={error ? 'text-center text-destructive' : 'text-center text-muted-foreground'}>
            {error ?? copy.hint}
          </Text>
        </View>
        <View className="mt-auto w-full gap-7">
          <PinPad key={step} onComplete={onPin} errorKey={errorKey} disabled={busy} />
          {/* Altura fixa, com ou sem botão: o teclado não muda de sítio entre passos. */}
          <View className="items-center justify-center" style={{ height: 52 }}>
            {mode === 'create' && step === 'choose' ? (
              <Button variant="ghost" className="min-h-12" onPress={leave}>
                <Text>Agora não</Text>
              </Button>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
