import { capitalize } from '@/components/reports/format';
import { TIME_OF_DAY_SUFFIX } from '@/constants/students';
import type { AppointmentTimeOfDay } from '@/database/schemas';
import dayjs, { type Dayjs } from 'dayjs';
import '@/lib/dayjs';

export function daysAhead(days: number): Date {
  return dayjs().add(days, 'day').startOf('day').toDate();
}

/** "segunda", "sábado": sem o "-feira" do locale. */
export function weekdayName(day: Dayjs): string {
  return day.format('dddd').replace('-feira', '');
}

export function dayKey(date: Date | Dayjs): string {
  return dayjs(date).format('YYYY-MM-DD');
}

/** "Sábado, 10 de Outubro, à tarde" */
export function formatReturnSummary(date: Date, timeOfDay: AppointmentTimeOfDay = 'any'): string {
  const day = dayjs(date);
  const weekday = capitalize(weekdayName(day));
  const month = capitalize(day.format('MMMM'));
  return `${weekday}, ${day.date()} de ${month}${TIME_OF_DAY_SUFFIX[timeOfDay]}`;
}

/** "Sáb, 10" */
export function formatShortDay(date: Date): string {
  const day = dayjs(date);
  return `${capitalize(weekdayName(day).slice(0, 3))}, ${day.date()}`;
}

/** "Daqui a 5 dias" */
export function formatDaysFromToday(date: Date): string {
  const days = dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days <= 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  return `Daqui a ${days} dias`;
}

/** "Outubro 2026" */
export function formatMonthTitle(month: Date): string {
  return capitalize(dayjs(month).format('MMMM YYYY'));
}
