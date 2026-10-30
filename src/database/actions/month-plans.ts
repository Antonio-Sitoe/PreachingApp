import { planDates, serializeWeekdays } from '@/utils/hours/plan';
import { and, asc, eq, gte, isNull } from 'drizzle-orm';
import dayjs from 'dayjs';
import { db } from '../db';
import { type MonthPlan, type PlanDay, monthPlans, planDays } from '../schemas/month-plans';
import type { PublisherType } from '../schemas/users';

export type MonthPlanInput = {
  year: number;
  month: number;
  publisherType: PublisherType;
  hourGoal: number;
  weekdays: readonly number[];
  minutesPerDay: number;
};

export type MonthPlanWithDays = MonthPlan & { days: PlanDay[] };

function nowIso() {
  return new Date().toISOString();
}

async function getForMonth(year: number, month: number): Promise<MonthPlanWithDays | null> {
  const plan = (
    await db
      .select()
      .from(monthPlans)
      .where(
        and(eq(monthPlans.year, year), eq(monthPlans.month, month), isNull(monthPlans.deletedAt))
      )
      .limit(1)
  )[0];
  if (!plan) return null;

  const days = await db
    .select()
    .from(planDays)
    .where(and(eq(planDays.monthPlanId, plan.id), isNull(planDays.deletedAt)))
    .orderBy(asc(planDays.day));
  return { ...plan, days };
}

// Os dias passados ficam como estavam; só se recriam os de hoje em diante.
function save(input: MonthPlanInput, today = dayjs()) {
  const now = nowIso();
  const todayKey = today.format('YYYY-MM-DD');
  const values = {
    publisherType: input.publisherType,
    hourGoal: input.hourGoal,
    weekdays: serializeWeekdays(input.weekdays),
    minutesPerDay: input.minutesPerDay,
    updatedAt: now,
    deletedAt: null,
    syncStatus: 'pending' as const,
  };

  return db.transaction((tx) => {
    // O índice único é por (ano, mês), por isso reaproveita-se a linha mesmo se foi apagada.
    const existing = tx
      .select()
      .from(monthPlans)
      .where(and(eq(monthPlans.year, input.year), eq(monthPlans.month, input.month)))
      .get();

    const plan = existing
      ? tx.update(monthPlans).set(values).where(eq(monthPlans.id, existing.id)).returning().get()
      : tx
          .insert(monthPlans)
          .values({ year: input.year, month: input.month, createdAt: now, ...values })
          .returning()
          .get();

    tx.update(planDays)
      .set({ deletedAt: now, updatedAt: now, syncStatus: 'pending' })
      .where(
        and(
          eq(planDays.monthPlanId, plan.id),
          gte(planDays.day, todayKey),
          isNull(planDays.deletedAt)
        )
      )
      .run();

    const dates = planDates(input.year, input.month, input.weekdays, today);
    if (dates.length > 0 && input.minutesPerDay > 0) {
      tx.insert(planDays)
        .values(
          dates.map((day) => ({
            monthPlanId: plan.id,
            day,
            plannedMinutes: input.minutesPerDay,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            syncStatus: 'pending' as const,
          }))
        )
        .run();
    }
    return plan;
  });
}

async function updateDay(id: string, plannedMinutes: number) {
  const updated = await db
    .update(planDays)
    .set({ plannedMinutes: Math.max(0, plannedMinutes), updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(planDays.id, id))
    .returning();
  return updated[0];
}

async function removeDay(id: string) {
  const updated = await db
    .update(planDays)
    .set({ deletedAt: nowIso(), updatedAt: nowIso(), syncStatus: 'pending' })
    .where(eq(planDays.id, id))
    .returning();
  return updated[0];
}

export const monthPlansActions = {
  getForMonth,
  save,
  updateDay,
  removeDay,
};
