import type { TimeEntrySource } from '../schemas';

export type TimeEntryInput = {
  startedAt: string;
  minutes: number;
  source: TimeEntrySource;
};

export type MonthStats = {
  minutes: number;
  daysOut: number;
};
