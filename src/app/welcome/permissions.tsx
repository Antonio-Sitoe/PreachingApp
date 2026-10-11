import { PermissionRow } from '@/components/onboarding/permission-row';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useOnboarding } from '@/contexts/onboarding';
import {
  checkPermission,
  openAppSettings,
  requestPermission,
  type PermissionKind,
  type PermissionStatus,
} from '@/utils/permissions';
import { router } from 'expo-router';
import * as React from 'react';
import { AppState, View } from 'react-native';

type Statuses = Record<PermissionKind, PermissionStatus>;

const showBackupAccount = false;

function allowsForward(status: PermissionStatus) {
  return status === 'granted';
}

/** Configuração inicial, passo 2 de 2 (canvas, artboard "Configuração inicial 2 de 2"). */
export default function PermissionsScreen() {
  const { complete } = useOnboarding();
  const [statuses, setStatuses] = React.useState<Statuses>({
    notifications: 'denied',
    location: 'denied',
  });

  // Lê o estado ao abrir e sempre que a pessoa volta das definições do telemóvel.
  // Uma permissão já marcada como recusada de vez só deixa de o estar se for concedida.
  const refresh = React.useCallback(async () => {
    const [notifications, location] = await Promise.all([
      checkPermission('notifications'),
      checkPermission('location'),
    ]);
    setStatuses((current) => ({
      notifications:
        current.notifications === 'blocked' && notifications === 'denied'
          ? 'blocked'
          : notifications,
      location: current.location === 'blocked' && location === 'denied' ? 'blocked' : location,
    }));
  }, []);

  React.useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const request = async (kind: PermissionKind) => {
    const status = await requestPermission(kind);
    setStatuses((current) => ({ ...current, [kind]: status }));
  };

  const canContinue = allowsForward(statuses.notifications) && allowsForward(statuses.location);

  return (
    <SetupLayout
      title="Configuração"
      step={2}
      contentClassName="gap-6 pt-7"
      footerClassName="gap-1"
      footer={
        <>
          <Button disabled={!canContinue} onPress={complete}>
            <Text>Começar a usar</Text>
          </Button>
          {showBackupAccount ? (
            <Button variant="ghost" className="h-12" onPress={() => router.push('/auth/sign-up')}>
              <Text>Criar conta para ter backup</Text>
            </Button>
          ) : null}
        </>
      }>
      <View className="gap-2">
        <Text variant="titleL">Duas permissões que ajudam</Text>
        <Text className="text-muted-foreground">
          Permite as duas para continuar. Podes mudar isto mais tarde em Mais, Definições.
        </Text>
      </View>

      <View className="gap-2.5">
        <PermissionRow
          icon="bell"
          title="Notificações"
          description="Lembretes das visitas e de quem está a sair do ritmo. São do próprio telemóvel."
          status={statuses.notifications}
          onRequest={() => request('notifications')}
          onOpenSettings={openAppSettings}
        />
        <PermissionRow
          icon="map-pin"
          title="Localização"
          description="Guarda onde conheceste cada pessoa e abre as direcções até lá."
          status={statuses.location}
          onRequest={() => request('location')}
          onOpenSettings={openAppSettings}
        />
      </View>
    </SetupLayout>
  );
}
