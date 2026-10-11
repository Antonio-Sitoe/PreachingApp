/**
 * Cópia de segurança (canvas, artboard "Restaurar cópia no primeiro arranque").
 *
 * POR FAZER: escolher o ficheiro e restaurar ainda não existem. Faltam o
 * expo-document-picker (para escolher o ficheiro), o formato da cópia e a
 * importação para a base de dados. Por agora este ficheiro só define o que o
 * ecrã precisa, para a interface ficar pronta.
 */
export type BackupSummary = {
  /** Texto pronto a mostrar: "Cópia de 28 de Setembro". */
  title: string;
  /** Texto pronto a mostrar: "42 pessoas, 318 visitas e 12 notas". */
  description: string;
};

/** Verdadeiro quando escolher e restaurar cópias já funcionar. */
export const BACKUP_RESTORE_AVAILABLE = false;

/** Exemplo do canvas, só para rever o ecrã em desenvolvimento. */
const SAMPLE_BACKUP: BackupSummary = {
  title: 'Cópia de 28 de Setembro',
  description: '42 pessoas, 318 visitas e 12 notas',
};

/**
 * Abre o selector de ficheiros e devolve o resumo da cópia escolhida.
 * Devolve `null` se a pessoa cancelar ou se ainda não for possível.
 * Em desenvolvimento devolve o exemplo do canvas, para se ver o ecrã preenchido.
 */
export async function pickBackupFile(): Promise<BackupSummary | null> {
  return __DEV__ ? SAMPLE_BACKUP : null;
}
