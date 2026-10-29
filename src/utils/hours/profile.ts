import { MONTHLY_HOUR_GOALS, resolveMonthlyHourGoal } from '@/database/actions/users';
import type { MonthPlan, PublisherType, User } from '@/database/schemas';

// Quem tem meta de horas relata horas; os outros só usam o cronómetro para si.
export function isPioneer(publisherType: PublisherType): boolean {
  return MONTHLY_HOUR_GOALS[publisherType].length > 0;
}

// A meta do mês vem do plano desse mês, se houver; senão, do perfil.
export function monthHourGoal(user: User | undefined, plan?: MonthPlan | null): number | null {
  if (plan) return plan.hourGoal;
  if (!user) return null;
  return resolveMonthlyHourGoal(user.publisherType, user.monthlyHourGoal);
}
