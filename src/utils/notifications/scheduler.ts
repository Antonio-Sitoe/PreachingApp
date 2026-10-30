import { monthlyReportNotificationManager } from '@/utils/notifications/monthly-report';
import { syncVisitReminders } from '@/utils/notifications/visit-reminders';
import { checkPermission } from '@/utils/permissions';
import { getNotificationPreferences, setNotificationPreferences } from '@/utils/storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let running: Promise<void> = Promise.resolve();

export function syncAllNotifications(): Promise<void> {
  running = running.then(runSync, runSync);
  return running;
}

async function runSync(): Promise<void> {
  try {
    if ((await checkPermission('notifications')) !== 'granted') return;

    const prefs = getNotificationPreferences();
    await monthlyReportNotificationManager.sync(prefs.monthly);
    await syncVisitReminders();

    setNotificationPreferences({
      ...getNotificationPreferences(),
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao agendar notificações:', error);
  }
}
