import type { MonthPlan, PlanDay, PublisherType } from '../schemas';

export type MonthPlanInput = {
  year: number;
  month: number;
  publisherType: PublisherType;
  hourGoal: number;
  weekdays: readonly number[];
  minutesPerDay: number;
};

export type MonthPlanWithDays = MonthPlan & { days: PlanDay[] };
