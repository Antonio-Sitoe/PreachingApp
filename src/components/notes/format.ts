import dayjs from 'dayjs';
import '@/lib/dayjs';

function capitalMonth(iso: string, pattern: string) {
  return dayjs(iso)
    .format(pattern)
    .replace(/(\d+\s(?:de\s)?)([a-zà-ú])/i, (_, lead: string, letter: string) => lead + letter.toUpperCase());
}

export function formatNoteDay(iso: string) {
  return capitalMonth(iso, 'D MMM YYYY');
}
