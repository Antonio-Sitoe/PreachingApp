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

// Só quem tem uma meta mensal fixa (pioneiro regular: 50 h) tem meta do ano.
export function yearlyHourGoal(publisherType: PublisherType): number | null {
  const goals = MONTHLY_HOUR_GOALS[publisherType];
  return goals.length === 1 ? goals[0] * 12 : null;
}
