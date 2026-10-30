import { capitalize } from '@/components/reports/format';
import { parseScriptures } from '@/database/actions/visits';
import type { Visit, VisitOutcome } from '@/database/schemas';
import { formatVisitDay } from '@/utils/students/list';
import { weekdayName } from '@/utils/students/return-date';
import dayjs from 'dayjs';
import '@/lib/dayjs';

/** "Segunda, 12 Out · 10:00", "Amanhã" */
export function formatAppointmentLabel(date: Date, time: string | null): string {
  const day = formatVisitDay(dayjs(date).startOf('day'), dayjs().startOf('day'));
  return time ? `${day} · ${time}` : day;
}

/** "há 3 dias", "hoje", "ainda sem visitas" */
export function formatSinceLastVisit(lastVisitAt: string | null): string {
  if (!lastVisitAt) return 'ainda sem visitas';
  const days = dayjs().startOf('day').diff(dayjs(lastVisitAt).startOf('day'), 'day');
  if (days <= 0) return 'hoje';
  return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

export function timeOf(date: Date): string {
  return dayjs(date).format('HH:mm');
}

export function withTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  return dayjs(date)
    .hour(hours || 0)
    .minute(minutes || 0)
    .second(0)
    .millisecond(0)
    .toDate();
}

export const OUTCOME_STYLES: Record<
  VisitOutcome,
  { label: string; bgClass: string; textClass: string }
> = {
  met: { label: 'Encontrei', bgClass: 'bg-success-soft', textClass: 'text-success' },
  not_home: { label: 'Não estava', bgClass: 'bg-muted', textClass: 'text-muted-foreground' },
  rescheduled: { label: 'Remarcada', bgClass: 'bg-warning-soft', textClass: 'text-warning' },
};

/** "28 Set · lição 13" ou "14 Set · 10:00" */
export function formatVisitTitle(visit: Visit): string {
  const day = dayjs(visit.visitedAt);
  const date = `${day.date()} ${capitalize(day.format('MMMM').slice(0, 3))}`;
  return visit.lessonNumber
    ? `${date} · lição ${visit.lessonNumber}`
    : `${date} · ${day.format('HH:mm')}`;
}

/** A primeira linha do que conversaram; sem nota, os textos ou "Tentativa". */
export function formatVisitSummary(visit: Visit): string {
  const firstLine = visit.notes?.split('\n').find((line) => line.trim());
  if (firstLine) return firstLine.trim();
  const scriptures = parseScriptures(visit.scriptures);
  if (scriptures.length > 0) return `Lemos ${scriptures.join(', ')}`;
  return visit.outcome === 'met' ? 'Sem notas' : 'Tentativa';
}

/** "Setembro"; noutro ano, "Setembro de 2025". */
export function formatMonthGroup(date: string): string {
  const day = dayjs(date);
  const month = capitalize(day.format('MMMM'));
  return day.year() === dayjs().year() ? month : `${month} de ${day.year()}`;
}

/** "Segunda, 28 de Setembro" */
export function formatVisitLongDate(date: string): string {
  const day = dayjs(date);
  return `${capitalize(weekdayName(day))}, ${day.date()} de ${capitalize(day.format('MMMM'))}`;
}
