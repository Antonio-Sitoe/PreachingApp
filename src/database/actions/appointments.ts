import dayjs from 'dayjs';
import { and, eq, gte, isNull, lt } from 'drizzle-orm';
import { db } from '../db';
import { appointments } from '../schemas';

/** Os dias (YYYY-MM-DD) do mês com marcações por cumprir. */
async function getScheduledDays(month: Date): Promise<string[]> {
  const start = dayjs(month).startOf('month');
  const rows = await db
    .select({ scheduledAt: appointments.scheduledAt })
    .from(appointments)
    .where(
      and(
        eq(appointments.status, 'pending'),
        isNull(appointments.deletedAt),
        gte(appointments.scheduledAt, start.toISOString()),
        lt(appointments.scheduledAt, start.add(1, 'month').toISOString())
      )
    );
  return [...new Set(rows.map((row) => dayjs(row.scheduledAt).format('YYYY-MM-DD')))];
}

export const appointmentsActions = {
  getScheduledDays,
};
