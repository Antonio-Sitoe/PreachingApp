import type { Student } from '../schemas';

export type ReminderTarget = {
  appointmentId: string;
  studentId: string;
  studentName: string;
  studentGender: Student['gender'];
  scheduledAt: string;
  /** HH:mm */
  time: string;
  remindMinutesBefore: number;
  lastLesson: number | null;
  promisedToBring: string | null;
};

export type ScheduleInput = {
  date: Date;
  /** HH:mm */
  time: string | null;
  remindMinutesBefore: number | null;
};
