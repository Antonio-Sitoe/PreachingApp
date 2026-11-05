import type { Appointment, Student, Visit } from '../schemas';

export type TodayItem = {
  student: Student;
  appointment: Appointment;
  lastMet: Visit | null;
};

export type OutOfRhythmItem = {
  student: Student;
  lastMet: Visit | null;
  /** Dias desde a data em que a visita devia ter acontecido pelo ritmo. */
  daysLate: number;
  /** Dias desde a última visita, ou desde o registo. */
  daysSince: number;
};

export type DoneTodayItem = {
  student: Student;
  visit: Visit;
  next: Appointment | null;
};

export type TodayData = {
  today: TodayItem[];
  overdue: (TodayItem & { daysLate: number })[];
  outOfRhythm: OutOfRhythmItem[];
  doneToday: DoneTodayItem[];
  tomorrow: TodayItem[];
  /** YYYY-MM-DD dos dias desta semana com marcações por cumprir. */
  weekDays: string[];
  studiesThisMonth: number;
  activeStudents: number;
};
