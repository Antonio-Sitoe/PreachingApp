import type { Student, StudentAvailability } from '@/database/schemas';
import { ofName } from '@/utils/students/journey';
import dayjs from 'dayjs';
import '@/lib/dayjs';

const RHYTHM_NAMES: Record<number, string> = {
  1: 'ritmo diário',
  7: 'ritmo semanal',
  14: 'ritmo quinzenal',
  30: 'ritmo mensal',
};

/** 1 (segunda) a 7 (domingo), como em `student_availabilities.weekday`. */
function weekdayOf(day: dayjs.Dayjs): number {
  return day.day() === 0 ? 7 : day.day();
}

export type NextVisitSuggestion = {
  date: Date;
  /** HH:mm */
  time: string | null;
  /** "Sugerida pelo ritmo semanal da Celeste" */
  hint: string;
};

/**
 * A data pelo ritmo a contar de `from`; com dias habituais, o primeiro desses dias
 * a partir daí, à melhor hora.
 */
export function suggestNextVisit(
  student: Pick<Student, 'displayName' | 'gender' | 'rhythmDays'>,
  availabilities: readonly Pick<StudentAvailability, 'weekday' | 'time'>[],
  from: Date,
  fallbackTime: string | null
): NextVisitSuggestion {
  const byRhythm = dayjs(from).startOf('day').add(student.rhythmDays, 'day');
  const rhythm = RHYTHM_NAMES[student.rhythmDays] ?? `ritmo de ${student.rhythmDays} dias`;
  const who = ofName(student.displayName, student.gender);

  const weekdays = new Set(availabilities.map((row) => row.weekday));
  if (weekdays.size > 0) {
    let day = byRhythm;
    while (!weekdays.has(weekdayOf(day))) day = day.add(1, 'day');
    return {
      date: day.toDate(),
      time: availabilities.find((row) => row.time)?.time ?? fallbackTime,
      hint: `Sugerida pelo ${rhythm} e pelos dias em que costuma estar`,
    };
  }

  return {
    date: byRhythm.toDate(),
    time: fallbackTime,
    hint: `Sugerida pelo ${rhythm} ${who}`,
  };
}
