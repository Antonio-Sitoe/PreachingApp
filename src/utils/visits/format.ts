import { formatVisitDay } from '@/utils/students/list';
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
