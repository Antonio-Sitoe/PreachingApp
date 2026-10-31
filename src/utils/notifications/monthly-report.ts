import type { MonthlyReminderConfig } from '@/utils/notifications/preferences';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'monthly-reminders';

export function nextTwelveMonthlyDates(hour: number, minute: number, now = new Date()): Date[] {
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1, hour, minute, 0, 0);
  const startOffset = thisMonth.getTime() > now.getTime() ? 0 : 1;

  return Array.from({ length: 12 }, (_, index) => {
    return new Date(now.getFullYear(), now.getMonth() + startOffset + index, 1, hour, minute, 0, 0);
  });
}

class MonthlyNotificationManager {
  async sync(
    monthly: MonthlyReminderConfig,
    sentMonths: ReadonlySet<string> = new Set()
  ): Promise<void> {
    await this.cancelAllMonthlyNotifications();
    if (!monthly.enabled) return;

    await this.prepareChannel(monthly);
    await this.scheduleNext12Months(monthly, sentMonths);
  }

  async cancelAllMonthlyNotifications(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const monthly = scheduled.filter((notification) =>
      notification.identifier.startsWith('monthly-reminder-')
    );

    for (const notification of monthly) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  private async prepareChannel(config: MonthlyReminderConfig): Promise<void> {
    try {
      await Notifications.deleteNotificationChannelAsync(CHANNEL_ID);
    } catch {}

    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Relatório mensal',
      importance: Notifications.AndroidImportance.HIGH,
      ...(config.sound ? {} : { sound: null }),
      enableVibrate: config.vibration,
      vibrationPattern: config.vibration ? [0, 250, 250, 250] : [0],
    });
  }

  private async scheduleNext12Months(
    config: MonthlyReminderConfig,
    sentMonths: ReadonlySet<string>
  ): Promise<void> {
    const dates = nextTwelveMonthlyDates(config.hour, config.minute);

    for (const date of dates) {
      const reported = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const year = reported.getFullYear();
      const month = reported.getMonth() + 1;
      if (sentMonths.has(`${year}-${String(month).padStart(2, '0')}`)) continue;
      const identifier = `monthly-reminder-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: config.title,
          body: config.body,
          sound: config.sound,
          data: { type: 'monthly-reminder', year, month },
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: config.vibration ? [0, 250, 250, 250] : [],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: CHANNEL_ID,
        },
      });
    }
  }
}

export const monthlyReportNotificationManager = new MonthlyNotificationManager();
