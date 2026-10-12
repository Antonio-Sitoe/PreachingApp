import type { MonthlyReminderConfig } from '@/utils/notifications/preferences';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'monthly-reminders';

/** O dia 1 deste mês, à hora pedida, se ainda não passou; senão, o dia 1 do mês seguinte. */
export function nextTwelveMonthlyDates(hour: number, minute: number, now = new Date()): Date[] {
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1, hour, minute, 0, 0);
  const startOffset = thisMonth.getTime() > now.getTime() ? 0 : 1;

  return Array.from({ length: 12 }, (_, index) => {
    return new Date(now.getFullYear(), now.getMonth() + startOffset + index, 1, hour, minute, 0, 0);
  });
}

class MonthlyNotificationManager {
  /** Apaga e volta a criar os lembretes. Quem chama já verificou a permissão. */
  async sync(monthly: MonthlyReminderConfig): Promise<void> {
    await this.cancelAllMonthlyNotifications();
    if (!monthly.enabled) return;

    await this.prepareChannel(monthly);
    await this.scheduleNext12Months(monthly);
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
    } catch {
      // O canal ainda não existe na primeira vez.
    }

    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Relatório mensal',
      importance: Notifications.AndroidImportance.HIGH,
      ...(config.sound ? {} : { sound: null }),
      enableVibrate: config.vibration,
      vibrationPattern: config.vibration ? [0, 250, 250, 250] : [0],
    });
  }

  private async scheduleNext12Months(config: MonthlyReminderConfig): Promise<void> {
    const dates = nextTwelveMonthlyDates(config.hour, config.minute);

    for (const date of dates) {
      const identifier = `monthly-reminder-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: config.title,
          body: config.body,
          sound: config.sound,
          data: { type: 'monthly-reminder' },
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
