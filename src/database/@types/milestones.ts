import type { MilestoneType } from '../schemas';

export type MilestoneInput = {
  studentId: string;
  label: string;
  /** Dia do marco, YYYY-MM-DD. */
  occurredAt: string;
  type?: MilestoneType;
};
