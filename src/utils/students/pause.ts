import { capitalize } from '@/components/reports/format';
import { PAUSE_REASON_OPTIONS } from '@/constants/students';
import type { Pause } from '@/database/schemas';
import dayjs from 'dayjs';
import '@/lib/dayjs';

/** "2 de Novembro"; noutro ano, "2 de Novembro de 2027". */
export function formatDayMonth(date: string | Date): string {
  const day = dayjs(date);
  const base = `${day.date()} de ${capitalize(day.format('MMMM'))}`;
  return day.year() === dayjs().year() ? base : `${base} de ${day.year()}`;
}

export function formatPauseReason(reason: Pause['reason']): string {
  return PAUSE_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? '';
}

export function formatPauseSummary(pause: Pick<Pause, 'reason' | 'note'>): string {
  return pause.note?.trim() || formatPauseReason(pause.reason);
}

/** "Tentar de novo a 2 de Novembro" ou "Sem data para tentar de novo" */
export function formatPauseRetry(retryAt: string | null): string {
  return retryAt ? `Tentar de novo a ${formatDayMonth(retryAt)}` : 'Sem data para tentar de novo';
}
