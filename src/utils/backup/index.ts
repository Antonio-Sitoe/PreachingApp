export type BackupSummary = {
  title: string;
  description: string;
};

export const BACKUP_RESTORE_AVAILABLE = false;

const SAMPLE_BACKUP: BackupSummary = {
  title: 'Cópia de 28 de Setembro',
  description: '42 pessoas, 318 visitas e 12 notas',
};

export async function pickBackupFile(): Promise<BackupSummary | null> {
  return __DEV__ ? SAMPLE_BACKUP : null;
}
