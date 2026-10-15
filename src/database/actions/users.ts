import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { type NewUser, type PublisherType, type User, users } from '../schemas';

export type UserInput = Pick<NewUser, 'name' | 'publisherType' | 'language' | 'monthlyHourGoal'>;

export type UserProfileInput = Required<Pick<UserInput, 'name' | 'publisherType' | 'language'>> &
  Pick<UserInput, 'monthlyHourGoal'>;

export const MONTHLY_HOUR_GOALS: Record<PublisherType, readonly number[]> = {
  publisher: [],
  bethelite: [],
  auxiliary_pioneer: [15, 30],
  circuit_overseer: [50],
  regular_pioneer: [50],
  special_pioneer: [90, 100],
  missionary: [90, 100],
};

const DEFAULT_MONTHLY_HOUR_GOAL: Partial<Record<PublisherType, number>> = {
  auxiliary_pioneer: 30,
  special_pioneer: 100,
  missionary: 100,
};

export function defaultMonthlyHourGoal(publisherType: PublisherType): number | null {
  const goals = MONTHLY_HOUR_GOALS[publisherType];
  if (goals.length === 0) return null;
  const preferred = DEFAULT_MONTHLY_HOUR_GOAL[publisherType];
  return preferred !== undefined && goals.includes(preferred) ? preferred : goals[0];
}

export function isMonthlyHourGoalAllowed(
  publisherType: PublisherType,
  goal: number | null
): boolean {
  const goals = MONTHLY_HOUR_GOALS[publisherType];
  return goal === null ? goals.length === 0 : goals.includes(goal);
}

export function resolveMonthlyHourGoal(
  publisherType: PublisherType,
  goal: number | null | undefined
): number | null {
  if (goal !== undefined && isMonthlyHourGoalAllowed(publisherType, goal)) return goal;
  return defaultMonthlyHourGoal(publisherType);
}

const now = () => new Date().toISOString();

class UsersActions {
  async getCurrent(): Promise<User | undefined> {
    const rows = await db.select().from(users).where(isNull(users.deletedAt)).limit(1);
    return rows[0];
  }

  async getById(id: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return rows[0];
  }

  async getAll(): Promise<User[]> {
    return db.select().from(users).where(isNull(users.deletedAt));
  }

  async create(data: UserInput): Promise<User> {
    try {
      const timestamp = now();
      const rows = await db
        .insert(users)
        .values({
          name: data.name?.trim() ?? '',
          publisherType: data.publisherType,
          language: data.language,
          monthlyHourGoal: data.monthlyHourGoal,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning();
      return rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateById(id: string, data: Partial<UserInput>): Promise<User | undefined> {
    try {
      const rows = await db
        .update(users)
        .set({
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.publisherType !== undefined && { publisherType: data.publisherType }),
          ...(data.language !== undefined && { language: data.language }),
          ...(data.monthlyHourGoal !== undefined && { monthlyHourGoal: data.monthlyHourGoal }),
          updatedAt: now(),
          syncStatus: 'pending',
        })
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .returning();
      return rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async saveProfile(profile: UserProfileInput): Promise<User> {
    const { monthlyHourGoal: chosenGoal, ...fields } = profile;
    const current = await this.getCurrent();
    const keptGoal =
      current && current.publisherType === fields.publisherType
        ? current.monthlyHourGoal
        : undefined;
    const monthlyHourGoal = resolveMonthlyHourGoal(fields.publisherType, chosenGoal ?? keptGoal);

    if (!current) return this.create({ ...fields, monthlyHourGoal });
    const updated = await this.updateById(current.id, { ...fields, monthlyHourGoal });
    return updated ?? current;
  }

  async deleteById(id: string): Promise<User | undefined> {
    try {
      const timestamp = now();
      const rows = await db
        .update(users)
        .set({ deletedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .returning();
      return rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const usersActions = new UsersActions();
