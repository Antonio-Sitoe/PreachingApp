import { AlertDialog } from '@/components/ui/alert-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import {
  BackupError,
  describeCounts,
  exportBackup,
  formatBackupDate,
  pickBackupFile,
  restoreBackup,
  type PickedBackup,
} from '@/utils/backup';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { getLastBackup, getThemePreference, setLastBackup, type LastBackup } from '@/utils/storage';
import { useQueryClient } from '@tanstack/react-query';
import type { File } from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

async function share(file: File) {
  try {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Partilhar cópia',
    });
  } catch {
    showToast({ message: 'Não foi possível partilhar a cópia.' });
  }
}

export default function BackupScreen() {
  const queryClient = useQueryClient();
  const [last, setLast] = React.useState<LastBackup | null>(getLastBackup);
  const [busy, setBusy] = React.useState(false);
  const [pending, setPending] = React.useState<PickedBackup | null>(null);

  const runExport = async () => {
    setBusy(true);
    try {
      const exported = await exportBackup();
      setLastBackup(exported.info);
      setLast(exported.info);
      const { file } = exported;
      showToast({
        message: exported.savedToDownloads
          ? 'Cópia guardada em Transferências'
          : 'Cópia criada. Partilha-a para a guardares.',
        action: { label: 'Partilhar', onPress: () => void share(file) },
      });
    } catch (error) {
      console.error('Error exporting backup:', error);
      showToast({ message: 'Não foi possível criar a cópia. Tenta de novo.' });
    } finally {
      setBusy(false);
    }
  };

  const pick = async () => {
    try {
      const picked = await pickBackupFile();
      if (picked) setPending(picked);
    } catch (error) {
      showToast({
        message:
          error instanceof BackupError ? error.message : 'Não foi possível abrir o ficheiro.',
      });
    }
  };

  const confirmRestore = async () => {
    if (!pending) return;
    setPending(null);
    setBusy(true);
    try {
      restoreBackup(pending.data);
      colorScheme.set(getThemePreference());
      await queryClient.invalidateQueries();
      void syncAllNotifications();
      showToast({ message: 'Cópia restaurada.' });
    } catch (error) {
      console.error('Error restoring backup:', error);
      showToast({ message: 'Não foi possível restaurar a cópia. Os dados não foram alterados.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Backup e restauro" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        <View className="items-center gap-3 rounded-lg border border-border bg-card px-4 py-5">
          <View className="size-14 items-center justify-center rounded-full bg-secondary">
            <AppIcon name="file" size={26} className="text-primary" />
          </View>
          <View className="items-center gap-1">
            <Text className="text-center font-display-semibold text-[17px] leading-[22px]">
              {last ? `Última cópia: ${formatBackupDate(last.createdAt)}` : 'Ainda sem cópias'}
            </Text>
            <Text className="text-center font-sans text-[13px] leading-[18px] text-muted-foreground">
              {last
                ? describeCounts(last.counts)
                : 'Exporta uma cópia para não perderes os teus dados.'}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Button disabled={busy} onPress={runExport}>
            <Text>Exportar cópia</Text>
          </Button>
          <Button
            variant="neutral"
            className="border border-border bg-card"
            disabled={busy}
            onPress={pick}>
            <Text>Restaurar de um ficheiro</Text>
          </Button>
        </View>

        <Text className="px-1 font-sans text-[13px] leading-[18px] text-muted-foreground">
          A cópia é um ficheiro que fica contigo: guarda-o na nuvem que usas ou envia-o para ti. Não
          precisa de conta nem de internet.
        </Text>

        <View
          role="note"
          className="flex-row items-start gap-2.5 rounded-lg bg-warning-soft px-4 py-3">
          <AppIcon name="alert" size={18} className="mt-px text-warning" />
          <Text className="flex-1 font-display-medium text-[13px] leading-[18px] text-warning">
            Restaurar substitui tudo o que está neste telemóvel pelo conteúdo do ficheiro.
          </Text>
        </View>
      </ScrollView>

      <AlertDialog
        open={pending !== null}
        onClose={() => setPending(null)}
        icon="alert"
        tone="warning"
        title="Restaurar esta cópia?"
        description={
          pending
            ? `O ficheiro de ${pending.date} tem ${pending.description}. Tudo o que está neste telemóvel é substituído.`
            : undefined
        }>
        <Button onPress={confirmRestore}>
          <Text>Restaurar</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={() => setPending(null)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </View>
  );
}
