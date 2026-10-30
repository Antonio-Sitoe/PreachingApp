import { TIME_OF_DAY_SUFFIX } from '@/constants/students';
import type { Appointment, Student, StudentAvailability } from '@/database/schemas';
import dayjs from 'dayjs';
import '@/lib/dayjs';
import { formatVisitDay } from './list';

const RHYTHM_LABELS: Record<number, string> = {
  7: 'Ritmo semanal',
  14: 'Ritmo quinzenal',
  30: 'Ritmo mensal',
};

/** "Ritmo semanal", "A cada 10 dias" */
export function formatRhythm(days: number): string {
  return RHYTHM_LABELS[days] ?? (days === 1 ? 'Ritmo diário' : `A cada ${days} dias`);
}

/** "Hoje, à tarde", "Quarta, 7 Out" */
export function formatNextVisit(appointment: Appointment): string {
  const today = dayjs().startOf('day');
  const day = dayjs(appointment.scheduledAt).startOf('day');
  return `${formatVisitDay(day, today)}${TIME_OF_DAY_SUFFIX[appointment.timeOfDay]}`;
}

export type NextVisitHint = {
  text: string;
  tone: 'default' | 'warning';
};

/** "Ritmo semanal · lembrete ligado", ou "Em atraso há 7 dias" se a data já passou. */
export function getNextVisitHint(student: Student, appointment: Appointment | null): NextVisitHint {
  if (appointment) {
    const late = dayjs().startOf('day').diff(dayjs(appointment.scheduledAt).startOf('day'), 'day');
    if (late > 0) {
      return {
        text: late === 1 ? 'Em atraso há 1 dia' : `Em atraso há ${late} dias`,
        tone: 'warning',
      };
    }
  }
  const rhythm = formatRhythm(student.rhythmDays);
  return {
    text: appointment?.remindMinutesBefore != null ? `${rhythm} · lembrete ligado` : rhythm,
    tone: 'default',
  };
}

// 1 (segunda) a 7 (domingo), com o artigo: "à segunda", "ao sábado".
const WEEKDAYS: Record<number, string> = {
  1: 'à segunda',
  2: 'à terça',
  3: 'à quarta',
  4: 'à quinta',
  5: 'à sexta',
  6: 'ao sábado',
  7: 'ao domingo',
};

function joinWithE(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/** "Costuma estar à segunda e à quinta, às 15:00" */
export function formatAvailability(availabilities: readonly StudentAvailability[]): string | null {
  const days = availabilities.map((row) => WEEKDAYS[row.weekday]).filter(Boolean);
  if (days.length === 0) return null;
  const time = availabilities.find((row) => row.time)?.time;
  return `Costuma estar ${joinWithE(days)}${time ? `, às ${time}` : ''}`;
}

/** "84 140 1000" para números de 9 dígitos; os outros ficam como foram escritos. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 9) return phone;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

/** Ligação do Google Maps com as direcções até ao ponto guardado, ou até à morada. */
export function getDirectionsUrl(student: Student): string | null {
  const destination =
    student.latitude != null && student.longitude != null
      ? `${student.latitude},${student.longitude}`
      : student.address?.trim();
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
