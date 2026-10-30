import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { PUBLISHER_TYPES, SYNC_STATUSES } from './users';

export const monthPlans = sqliteTable(
  'month_plans',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    publisherType: text('publisher_type', { enum: PUBLISHER_TYPES }).notNull(),
    hourGoal: integer('hour_goal').notNull(),
    // Dias da semana, de 1 (segunda) a 7 (domingo), separados por vírgula.
    weekdays: text('weekdays').notNull().default(''),
    minutesPerDay: integer('minutes_per_day').notNull().default(0),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [uniqueIndex('month_plans_year_month_idx').on(table.year, table.month)]
);

export const planDays = sqliteTable(
  'plan_days',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    monthPlanId: text('month_plan_id')
      .notNull()
      .references(() => monthPlans.id, { onDelete: 'cascade' }),
    // YYYY-MM-DD.
    day: text('day').notNull(),
    plannedMinutes: integer('planned_minutes').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [index('plan_days_plan_day_idx').on(table.monthPlanId, table.day)]
);

export type MonthPlan = typeof monthPlans.$inferSelect;
export type NewMonthPlan = typeof monthPlans.$inferInsert;
export type PlanDay = typeof planDays.$inferSelect;
export type NewPlanDay = typeof planDays.$inferInsert;
