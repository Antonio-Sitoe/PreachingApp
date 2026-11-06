import type { UndoBlockReason } from '@/utils/study/lesson-edit';
import type { LessonAdvance, LessonProgress, StudentStage } from '../schemas';

export type AdvanceInput = {
  studentId: string;
  visitId: string;
  previousVisitLesson: number | null;
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
  advanceId: string | null;
};

export type AdvanceUndoData = {
  createdIds: string[];
  closedIds: string[];
  goalDone: { id: string; previous: boolean } | null;
  stageChangeId: string | null;
  fromStage: StudentStage | null;
};

export type UndoableAdvance = {
  advance: LessonAdvance;
  blocked: UndoBlockReason | null;
  /** Lições criadas por este avanço que já têm nota. */
  lessonsWithNotes: number[];
};

export type LessonDetail = {
  row: LessonProgress | null;
  visitCount: number;
  questions: { visitId: string; question: string; askedAt: string }[];
};
