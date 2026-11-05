import type { Appointment, Student, Visit, VisitOutcome } from '../schemas';

export type NextVisitInput = {
  date: Date;
  /** HH:mm */
  time: string | null;
  remindMinutesBefore: number | null;
};

export type VisitInput = {
  studentId: string;
  visitedAt: Date;
  outcome: VisitOutcome;
  notes?: string;
  scriptures?: string[];
  pendingQuestion?: string;
  promisedToBring?: string;
  lessonNumber?: number | null;
  stoppedAtPoint?: string;
  next?: NextVisitInput | null;
};

export type VisitEdit = Omit<VisitInput, 'studentId' | 'next'>;

export type VisitDetail = {
  visit: Visit;
  student: Student;
  /** A marcação feita ao guardar esta visita. */
  next: Appointment | null;
};
