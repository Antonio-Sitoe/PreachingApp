import { MONTHLY_HOUR_GOALS, resolveMonthlyHourGoal } from '@/database/actions/users';
import type { MonthPlan, PublisherType, User } from '@/database/schemas';

export function isPioneer(publisherType: PublisherType): boolean {
  return MONTHLY_HOUR_GOALS[publisherType].length > 0;
}

export function monthHourGoal(user: User | undefined, plan?: MonthPlan | null): number | null {
  if (plan) return plan.hourGoal;
  if (!user) return null;
  return resolveMonthlyHourGoal(user.publisherType, user.monthlyHourGoal);
}
