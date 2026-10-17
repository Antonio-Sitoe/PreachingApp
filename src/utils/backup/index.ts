import { backupActions, type BackupTables } from '@/database/actions';
import journal from '@/database/migrations/meta/_journal.json';
import { monthNameToPortuguese } from '@/utils/dates';
import { mergeNotificationPreferences } from '@/utils/notifications/preferences';
import {
  getListView,
  getNotificationPreferences,
  getThemePreference,
  isReportListGrouped,
  LIST_VIEWS,
  setListView,
  setNotificationPreferences,
  setReportListGrouped,
  setThemePreference,
  THEME_PREFERENCES,
  type LastBackup,
} from '@/utils/storage';
import { File, Paths } from 'expo-file-system';
import { z } from 'zod';
import { saveTextToDownloads } from '../../../modules/downloads';

const BACKUP_FORMAT = 'preaching-assistant-backup';
const BACKUP_VERSION = 1;
const SCHEMA_VERSION = journal.entries.length;
const BACKUP_MIME = 'application/json';

const COUNT_LABELS: Record<string, [string, string]> = {
  students: ['estudante', 'estudantes'],
  visits: ['visita', 'visitas'],
  notes: ['nota', 'notas'],
};

const backupFileSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.literal(BACKUP_VERSION),
  schemaVersion: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  settings: z
    .object({
      theme: z.enum(THEME_PREFERENCES).optional(),
      listView: z.enum(LIST_VIEWS).optional(),
      reportListGrouped: z.boolean().optional(),
      notifications: z.unknown().optional(),
    })
    .default({}),
  tables: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

type BackupFile = z.infer<typeof backupFileSchema>;

export type BackupSummary = {
  date: string;
  title: string;
  description: string;
};

export type PickedBackup = BackupSummary & {
  data: BackupFile;
};

export class BackupError extends Error {}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dayName(date: Date): string {
  const name = `${date.getDate()} de ${capitalize(monthNameToPortuguese(date.getMonth() + 1))}`;
  return date.getFullYear() === new Date().getFullYear()
    ? name
    : `${name} de ${date.getFullYear()}`;
}

export function formatBackupDate(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days === 0) return `hoje, ${time}`;
  if (days === 1) return `ontem, ${time}`;
  return dayName(date);
}

function countRows(tables: BackupTables): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const name of Object.keys(COUNT_LABELS)) {
    const rows = tables[name];
    if (rows) counts[name] = rows.filter((row) => !row.deletedAt).length;
  }
  return counts;
}

export function describeCounts(counts: Record<string, number>): string {
  const parts = Object.entries(COUNT_LABELS)
    .filter(([name]) => counts[name] !== undefined)
    .map(([name, [singular, plural]]) => {
      const count = counts[name];
      return `${count} ${count === 1 ? singular : plural}`;
    });
  if (parts.length <= 1) return parts[0] ?? '';
  return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
}

function fileName(createdAt: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const date = `${createdAt.getFullYear()}-${pad(createdAt.getMonth() + 1)}-${pad(createdAt.getDate())}`;
  const time = `${pad(createdAt.getHours())}${pad(createdAt.getMinutes())}`;
  return `preaching-assistant-${date}-${time}.json`;
}

export type ExportedBackup = {
  file: File;
  savedToDownloads: boolean;
  info: LastBackup;
};

export async function exportBackup(): Promise<ExportedBackup> {
  const createdAt = new Date();
  const tables = await backupActions.readAll();
  const data: BackupFile = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    schemaVersion: SCHEMA_VERSION,
    createdAt: createdAt.toISOString(),
    settings: {
      theme: getThemePreference(),
      listView: getListView(),
      reportListGrouped: isReportListGrouped(),
      notifications: getNotificationPreferences(),
    },
    tables,
  };
  const content = JSON.stringify(data);
  const name = fileName(createdAt);

  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(content);

  let savedToDownloads = false;
  try {
    savedToDownloads = (await saveTextToDownloads(name, BACKUP_MIME, content)) !== null;
  } catch (error) {
    console.error('Error saving backup to Downloads:', error);
  }

  return {
    file,
    savedToDownloads,
    info: { createdAt: data.createdAt, counts: countRows(tables) },
  };
}

function parseBackup(raw: string): BackupFile {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new BackupError('Este ficheiro não é uma cópia do Preaching Assistant.');
  }

  const parsed = backupFileSchema.safeParse(json);
  if (!parsed.success) {
    throw new BackupError('Este ficheiro não é uma cópia do Preaching Assistant.');
  }
  if (parsed.data.schemaVersion > SCHEMA_VERSION) {
    throw new BackupError(
      'Esta cópia vem de uma versão mais recente do app. Actualiza o app primeiro.'
    );
  }

  if (Object.keys(parsed.data.tables).some((name) => !backupActions.hasTable(name))) {
    throw new BackupError(
      'Esta cópia vem de uma versão mais recente do app. Actualiza o app primeiro.'
    );
  }

  return parsed.data;
}

export function summarizeBackup(data: BackupFile): BackupSummary {
  const date = dayName(new Date(data.createdAt));
  return {
    date,
    title: `Cópia de ${date}`,
    description: describeCounts(countRows(data.tables)),
  };
}

export async function pickBackupFile(): Promise<PickedBackup | null> {
  const picked = await File.pickFileAsync({ mimeTypes: [BACKUP_MIME, 'application/octet-stream'] });
  if (picked.canceled) return null;
  const data = parseBackup(await picked.result.text());
  return { ...summarizeBackup(data), data };
}

export function restoreBackup(data: BackupFile): void {
  backupActions.replaceAll(data.tables);

  const { settings } = data;
  if (settings.theme) setThemePreference(settings.theme);
  if (settings.listView) setListView(settings.listView);
  if (settings.reportListGrouped !== undefined) setReportListGrouped(settings.reportListGrouped);
  if (settings.notifications !== undefined) {
    setNotificationPreferences(
      mergeNotificationPreferences(JSON.stringify(settings.notifications))
    );
  }
}
