import dayjs from 'dayjs';
import '@/lib/dayjs';

export function formatNoteDay(iso: string) {
  return dayjs(iso).format('D MMM');
}

export function formatNoteYear(iso: string) {
  return dayjs(iso).format('YY');
}

export function formatNoteTime(date: Date) {
  return dayjs(date).format('HH:mm');
}
