import { Logo } from '@/components/brand/logo';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLock } from '@/contexts/lock';
import { useOnboarding } from '@/contexts/onboarding';
import { usersActions } from '@/database/actions';
import {
  disableLock,
  getBlockedUntil,
  hasPin,
  MAX_ATTEMPTS,
  registerFailure,
  resetFailures,
  verifyPin,
} from '@/utils/lock';
import { authenticate } from '@/utils/lock/biometric';
import { wipeLocalData } from '@/utils/lock/wipe';
import { isBiometricEnabled } from '@/utils/storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinPad } from './pin-pad';

const tries = (count: number) => `${count} ${count === 1 ? 'tentativa' : 'tentativas'}`;

function formatWait(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function LockScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { unlock } = useLock();
  const { reset } = useOnboarding();
  const biometric = React.useMemo(isBiometricEnabled, []);
  const [errorKey, setErrorKey] = React.useState(0);
  const [attemptsLeft, setAttemptsLeft] = React.useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = React.useState(() => getBlockedUntil());
  const [now, setNow] = React.useState(Date.now());
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [confirmWipe, setConfirmWipe] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });

  const blocked = blockedUntil > now;

  React.useEffect(() => {
    if (!blocked) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [blocked]);

  const enter = React.useCallback(() => {
    resetFailures();
    unlock();
  }, [unlock]);

  const tryBiometric = React.useCallback(async () => {
    if (await authenticate()) enter();
  }, [enter]);

  React.useEffect(() => {
    void (async () => {
      // Bloqueio ligado sem PIN (ex.: cópia do Android sem a chave do Keystore): não prende ninguém.
      if (!(await hasPin())) {
        await disableLock();
        unlock();
        return;
      }
      if (biometric && !getBlockedUntil()) void tryBiometric();
    })();
  }, [biometric, tryBiometric, unlock]);

  const check = async (pin: string) => {
    setChecking(true);
    const ok = await verifyPin(pin);
    setChecking(false);
    if (ok) {
      enter();
      return;
    }
    const result = registerFailure();
    setErrorKey((key) => key + 1);
    setAttemptsLeft(result.blockedUntil ? null : result.attemptsLeft);
    if (result.blockedUntil) {
      setNow(Date.now());
      setBlockedUntil(result.blockedUntil);
    }
  };

  const wipe = async () => {
    setConfirmWipe(false);
    await wipeLocalData();
    queryClient.clear();
    reset();
    unlock();
    // Depois do redirecionamento para /welcome, que só acontece no próximo render.
    setTimeout(() => router.replace('/welcome/restore'), 100);
  };

  const name = user?.name.trim();
  const title = attemptsLeft !== null && !blocked ? 'PIN errado' : name ? `Olá, ${name}` : 'Olá';
  const subtitle = blocked
    ? `Erraste o PIN ${MAX_ATTEMPTS} vezes. Espera ${formatWait(blockedUntil - now)} para tentar de novo.`
    : attemptsLeft !== null
      ? `Tenta de novo. ${attemptsLeft === 1 ? 'Falta' : 'Faltam'} ${tries(attemptsLeft)} antes de esperar 1 minuto.`
      : 'Escreve o teu PIN para entrar';

  return (
    <View
      style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 }]}
      className="items-center gap-7 bg-background px-6">
      <Logo width={120} />
      <View className="items-center gap-2">
        <Text variant="titleXl" className="text-center">
          {title}
        </Text>
        <Text
          variant="bodyM"
          role={attemptsLeft !== null || blocked ? 'alert' : undefined}
          className={attemptsLeft !== null && !blocked ? 'text-center text-destructive' : 'text-center text-muted-foreground'}>
          {subtitle}
        </Text>
      </View>

      <View className="mt-auto w-full max-w-[400px]">
        <PinPad
          onComplete={check}
          errorKey={errorKey}
          disabled={blocked || checking}
          onBiometric={biometric ? tryBiometric : undefined}
        />
      </View>

      <Button variant="ghost" className="min-h-12" onPress={() => setForgotOpen(true)}>
        <Text>Esqueci-me do PIN</Text>
      </Button>

      <BottomSheet open={forgotOpen} onClose={() => setForgotOpen(false)} title="Esqueceste-te do PIN?">
        <Text variant="bodyM" className="text-muted-foreground">
          O PIN não se recupera. Para voltar a entrar é preciso apagar os dados deste telemóvel e
          restaurar a última cópia.
        </Text>
        <View className="gap-1">
          <Button
            variant="destructive"
            onPress={() => {
              setForgotOpen(false);
              setConfirmWipe(true);
            }}>
            <Text>Restaurar de uma cópia</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" onPress={() => setForgotOpen(false)}>
            <Text>Tentar o PIN de novo</Text>
          </Button>
        </View>
      </BottomSheet>

      <AlertDialog
        open={confirmWipe}
        onClose={() => setConfirmWipe(false)}
        icon="trash"
        tone="destructive"
        title="Apagar os dados deste telemóvel?"
        description="Estudantes, notas e horas são apagados deste telemóvel. Depois escolhes o ficheiro de cópia para os trazer de volta. Sem cópia, perdem-se.">
        <Button variant="destructive" onPress={() => void wipe()}>
          <Text>Apagar e restaurar</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={() => setConfirmWipe(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </View>
  );
}

export { LockScreen };
