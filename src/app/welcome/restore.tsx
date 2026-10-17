import { SetupLayout } from '@/components/onboarding/setup-layout';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { useOnboarding } from '@/contexts/onboarding';
import { BackupError, pickBackupFile, restoreBackup, type PickedBackup } from '@/utils/backup';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { getThemePreference } from '@/utils/storage';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';

export default function RestoreScreen() {
  const queryClient = useQueryClient();
  const { complete } = useOnboarding();
  const [backup, setBackup] = React.useState<PickedBackup | null>(null);
  const [restoring, setRestoring] = React.useState(false);

  const pick = async () => {
    try {
      const picked = await pickBackupFile();
      if (picked) setBackup(picked);
    } catch (error) {
      showToast({
        message:
          error instanceof BackupError ? error.message : 'Não foi possível abrir o ficheiro.',
      });
    }
  };

  const restore = async () => {
    if (!backup) return;
    setRestoring(true);
    try {
      restoreBackup(backup.data);
      colorScheme.set(getThemePreference());
      await queryClient.invalidateQueries();
      void syncAllNotifications();
      complete();
    } catch (error) {
      console.error('Error restoring backup:', error);
      showToast({ message: 'Não foi possível restaurar a cópia. Os dados não foram alterados.' });
      setRestoring(false);
    }
  };

  return (
    <SetupLayout
      title="Restaurar cópia"
      contentClassName="pt-5"
      footerClassName="gap-2"
      footer={
        <>
          <Button disabled={!backup || restoring} onPress={restore}>
            <Text>Restaurar e começar</Text>
          </Button>
          <Button variant="ghost" className="h-12" onPress={() => router.push('/welcome/setup')}>
            <Text>Começar sem cópia</Text>
          </Button>
        </>
      }>
      <View className="gap-2">
        <Text
          role="heading"
          aria-level="2"
          className="font-sans-semibold text-[22px] leading-[26px]">
          Traz os teus dados
        </Text>
        <Text className="text-[15px] leading-5 text-muted-foreground">
          Escolhe o ficheiro de cópia que exportaste no outro telemóvel. Não é preciso conta nem
          internet.
        </Text>
      </View>

      <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card py-3.5 pl-4 pr-2">
        <View className="size-11 shrink-0 items-center justify-center rounded-full bg-secondary">
          <AppIcon name="file" size={22} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="titleS" numberOfLines={1}>
            {backup ? backup.title : 'Nenhuma cópia escolhida'}
          </Text>
          <Text variant="bodyS" className="text-muted-foreground">
            {backup ? backup.description : 'O ficheiro que exportaste em Mais, Backup e restauro'}
          </Text>
        </View>
        <Button variant="ghost" size="sm" className="px-2" onPress={pick}>
          <Text className="font-display-semibold text-[14px] leading-[19px]">
            {backup ? 'Trocar' : 'Escolher'}
          </Text>
        </Button>
      </View>

      <Text className="px-1 text-[13px] leading-[18px] text-muted-foreground">
        A língua, o tipo de publicador e as definições vêm também na cópia.
      </Text>
    </SetupLayout>
  );
}
