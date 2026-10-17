import { sql } from 'drizzle-orm';
import { db } from '../db';
import { usageCounters, type UsageEvent } from '../schemas';

function today(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

async function increment(event: UsageEvent): Promise<void> {
  const insert = db.insert(usageCounters).values({ day: today(), event, count: 1 });
  if (event === 'app_open') {
    await insert.onConflictDoNothing();
    return;
  }
  await insert.onConflictDoUpdate({
    target: [usageCounters.day, usageCounters.event],
    set: { count: sql`${usageCounters.count} + 1`, sentAt: null },
  });
}

export const usageActions = {
  increment,
};
