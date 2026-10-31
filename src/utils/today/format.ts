import { capitalize } from '@/components/reports/format';
import { TIME_OF_DAY_SUFFIX } from '@/constants/students';
import { parseScriptures } from '@/database/actions/visits';
import type { Appointment, Student, Visit } from '@/database/schemas';
import { weekdayName } from '@/utils/students/return-date';
import dayjs from 'dayjs';
import '@/lib/dayjs';

/** "Segunda, 5 de Outubro" */
export function formatTodayHeader(date = new Date()): string {
  const day = dayjs(date);
  return `${capitalize(weekdayName(day))}, ${day.date()} de ${capitalize(day.format('MMMM'))}`;
}

/** "10:00", "à tarde" ou "" */
export function formatAppointmentTime(appointment: Appointment): string {
  if (appointment.time) return appointment.time;
  return TIME_OF_DAY_SUFFIX[appointment.timeOfDay].replace(/^, /, '');
}

/** "Lição 14 · levar a brochura", "Falámos de Apocalipse 21:4" */
export function formatPrepLine(student: Student, lastMet: Visit | null): string | null {
  if (lastMet) {
    const extra = lastMet.promisedToBring
      ? `levar ${lastMet.promisedToBring}`
      : lastMet.pendingQuestion
        ? `dúvida: ${lastMet.pendingQuestion}`
        : null;
    if (lastMet.lessonNumber) {
      return extra ? `Lição ${lastMet.lessonNumber} · ${extra}` : `Lição ${lastMet.lessonNumber}`;
    }
    if (extra) return capitalize(extra);
    const scriptures = parseScriptures(lastMet.scriptures);
    if (scriptures.length > 0) return `Falámos de ${scriptures.join(', ')}`;
    const firstLine = lastMet.notes?.split('\n').find((line) => line.trim());
    if (firstLine) return firstLine.trim();
  }
  return student.note?.trim() || null;
}

/** "há 1 dia", "há 5 dias" */
export function formatDaysAgo(days: number): string {
  return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

/** "Lição 14 · próxima: segunda, 10:00" */
export function formatDoneLine(visit: Visit, next: Appointment | null): string {
  const what =
    visit.outcome === 'not_home'
      ? 'Não estava em casa'
      : visit.outcome === 'rescheduled'
        ? 'Remarcada'
        : visit.lessonNumber
          ? `Lição ${visit.lessonNumber}`
          : 'Visita registada';
  if (!next) return what;
  const day = weekdayName(dayjs(next.scheduledAt));
  return `${what} · próxima: ${day}${next.time ? `, ${next.time}` : ''}`;
}

export function weekOf(date = new Date()): Date[] {
  const today = dayjs(date).startOf('day');
  const monday = today.subtract((today.day() + 6) % 7, 'day');
  return Array.from({ length: 7 }, (_, index) => monday.add(index, 'day').toDate());
}

/** "a brochura; o convite" → ["a brochura", "o convite"] */
export function splitPromised(value: string | null): string[] {
  return (value ?? '')
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}
