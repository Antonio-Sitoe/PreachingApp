import type { db } from '../db';
import type {
  Appointment,
  AppointmentTimeOfDay,
  NewStudent,
  Pause,
  PauseReason,
  StageChange,
  Student,
  StudentAvailability,
} from '../schemas';

export type StudentInput = Pick<
  NewStudent,
  | 'displayName'
  | 'nameIsProvisional'
  | 'note'
  | 'phone'
  | 'ageRange'
  | 'gender'
  | 'stage'
  | 'status'
  | 'rhythmDays'
  | 'latitude'
  | 'longitude'
  | 'address'
  | 'directions'
  | 'locatedAt'
>;

export type StudentLocation = {
  latitude: number;
  longitude: number;
  address?: string | null;
};

export type ReturnOn = {
  date: Date;
  timeOfDay?: AppointmentTimeOfDay;
};

export type QuickStudentInput = {
  name: string;
  nameIsProvisional?: boolean;
  note?: string;
  location?: StudentLocation | null;
  returnOn?: ReturnOn | null;
  rhythmDays?: number;
};

export type QuickStudentResult = {
  student: Student;
  appointment: Appointment | null;
};

export type StudentNextVisit = {
  scheduledAt: string;
  timeOfDay: AppointmentTimeOfDay;
  time: string | null;
};

export type StudentListItem = Student & {
  nextVisit: StudentNextVisit | null;
  lastVisitAt: string | null;
  lastLesson: number | null;
  pause: Pick<Pause, 'reason' | 'note' | 'retryAt'> | null;
};

export type PauseInput = {
  reason: PauseReason;
  note?: string | null;
  /** Dia para tentar de novo, YYYY-MM-DD. */
  retryAt?: string | null;
};

/** Dias da semana em que costuma estar (1 = segunda … 7 = domingo) e a melhor hora, HH:mm. */
export type AvailabilityInput = {
  weekdays: number[];
  time: string | null;
};

export type StudentDetail = {
  student: Student;
  nextVisit: Appointment | null;
  availabilities: StudentAvailability[];
};

export type StudentJourney = {
  student: Student;
  /** Mudanças de etapa, da mais antiga para a mais recente. */
  stageChanges: StageChange[];
};

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
