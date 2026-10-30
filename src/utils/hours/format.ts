import dayjs from 'dayjs';

const pad = (value: number) => String(value).padStart(2, '0');

// "1 h 30", "2 h 00" ou "52 min".
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  if (total < 60) return `${total} min`;
  return `${Math.floor(total / 60)} h ${pad(total % 60)}`;
}

// "1 h 30" ou "30 h".
export function formatHours(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const rest = total % 60;
  return rest === 0 ? `${total / 60} h` : `${Math.floor(total / 60)} h ${pad(rest)}`;
}

// "28h30".
export function formatHero(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  return `${Math.floor(total / 60)}h${pad(total % 60)}`;
}

// "01:24:36".
export function formatClock(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}

// "08:40".
export function formatTimeOfDay(value: string | number | Date): string {
  return dayjs(value).format('HH:mm');
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

// "Sábado, 3 Out".
export function formatEntryDay(value: string | Date): string {
  const date = dayjs(value);
  const weekday = capitalize(date.format('dddd').replace('-feira', ''));
  return `${weekday}, ${date.date()} ${capitalize(date.format('MMM').replace('.', ''))}`;
}

// "Outubro".
export function formatMonthName(year: number, month: number): string {
  return capitalize(dayjs(new Date(year, month - 1, 1)).format('MMMM'));
}
