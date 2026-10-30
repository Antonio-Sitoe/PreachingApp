import dayjs, { type Dayjs } from 'dayjs';
import { formatDuration, formatHours } from './format';

// 1 = segunda ... 7 = domingo, como em month_plans.weekdays.
export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const WEEKDAY_SHORT: Record<number, string> = {
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
  7: 'Dom',
};

export function isoWeekday(date: Dayjs): number {
  return ((date.day() + 6) % 7) + 1;
}

export function parseWeekdays(value: string): number[] {
  return value
    .split(',')
    .map(Number)
    .filter((day) => day >= 1 && day <= 7)
    .sort((a, b) => a - b);
}

export function serializeWeekdays(days: readonly number[]): string {
  return [...new Set(days)].sort((a, b) => a - b).join(',');
}

export function planDates(
  year: number,
  month: number,
  weekdays: readonly number[],
  from: Dayjs = dayjs()
): string[] {
  const monthStart = dayjs(new Date(year, month - 1, 1));
  const monthEnd = monthStart.endOf('month');
  let cursor = from.isAfter(monthStart) ? from.startOf('day') : monthStart;
  const dates: string[] = [];

  while (!cursor.isAfter(monthEnd, 'day')) {
    if (weekdays.includes(isoWeekday(cursor))) dates.push(cursor.format('YYYY-MM-DD'));
    cursor = cursor.add(1, 'day');
  }
  return dates;
}

export function remainingMinutes(goalHours: number, doneMinutes: number): number {
  return Math.max(0, goalHours * 60 - doneMinutes);
}

// Conta com hoje.
export function daysLeftInMonth(today: Dayjs = dayjs()): number {
  return today.daysInMonth() - today.date() + 1;
}

export function perDay(remaining: number, days: number): number {
  return days > 0 ? Math.ceil(remaining / days) : 0;
}

// "12 dias × 2 h = 24 h. Chega para as 22 h 30 que faltam, com 1 h 30 de folga."
export function planSummary(days: number, minutesPerDay: number, remaining: number): string {
  if (remaining <= 0) return 'A meta do mês já está cumprida.';
  if (days === 0) return 'Escolhe pelo menos um dia para ver se chega para a meta.';

  const total = days * minutesPerDay;
  const sum = `${days} ${days === 1 ? 'dia' : 'dias'} × ${formatHours(minutesPerDay)} = ${formatHours(total)}.`;
  if (total < remaining) {
    return `${sum} Não chega: das ${formatDuration(remaining)} que faltam, ficam ${formatDuration(remaining - total)} por fazer.`;
  }
  if (total === remaining) return `${sum} Chega certo para as ${formatDuration(remaining)} que faltam.`;
  return `${sum} Chega para as ${formatDuration(remaining)} que faltam, com ${formatDuration(total - remaining)} de folga.`;
}
