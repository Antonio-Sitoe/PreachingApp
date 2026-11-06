import type { LessonProgress } from '../schemas';

export type AdvanceInput = {
  studentId: string;
  lesson: number;
  date: Date;
  /** "Tente o seguinte" da lição que fica fechada agora. */
  previousGoalDone?: boolean;
  closeSkipped?: boolean;
};

export type AdvanceResult = {
  startedLesson: number | null;
  closedLessons: number[];
  /** Parte cuja última lição ficou fechada agora: 1 a 4. */
  completedPart: number | null;
  studyStarted: boolean;
};

export type LessonDetail = {
  row: LessonProgress | null;
  visitCount: number;
  questions: { visitId: string; question: string; askedAt: string }[];
};
