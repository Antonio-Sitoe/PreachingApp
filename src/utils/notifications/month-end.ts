import type { MonthlyReminderConfig } from '@/utils/notifications/preferences';
import { formatMonthName } from '@/utils/hours/format';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'monthly-reminders';
const PREFIX = 'month-end-';
export const MONTH_END_DAYS = 3;

export type MonthEndData = { type: 'month-end' };

export function isMonthEnd(data: unknown): data is MonthEndData {
  return (data as { type?: unknown } | null)?.type === 'month-end';
}

async function cancelAll(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.identifier.startsWith(PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Volta a ser calculado a cada abertura do app: some assim que há uma visita ou horas no mês.
export async function syncMonthEndNotice(
  monthly: MonthlyReminderConfig,
  participated: boolean,
  now = new Date()
): Promise<void> {
  await cancelAll();
  if (!monthly.enabled || participated) return;

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    lastDay - (MONTH_END_DAYS - 1),
    monthly.hour,
    monthly.minute
  );
  if (date.getTime() <= now.getTime()) return;

  const monthName = formatMonthName(now.getFullYear(), now.getMonth() + 1);
  await Notifications.scheduleNotificationAsync({
    identifier: `${PREFIX}${now.getFullYear()}-${now.getMonth() + 1}`,
    content: {
      title: `${monthName} acaba daqui a ${MONTH_END_DAYS} dias`,
      body: 'Ainda não há nenhuma visita registada este mês.',
      data: { type: 'month-end' } satisfies MonthEndData,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
  });
}
