import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'timer-reminders';
const IDENTIFIER = 'timer-forgotten';
export const FORGOTTEN_AFTER_MS = 4 * 60 * 60 * 1000;

export async function scheduleForgottenTimerReminder(elapsedMs: number): Promise<void> {
  await cancelForgottenTimerReminder();
  const seconds = Math.max(60, Math.round((FORGOTTEN_AFTER_MS - elapsedMs) / 1000));

  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Cronómetro esquecido',
      importance: Notifications.AndroidImportance.HIGH,
    });
    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIER,
      content: {
        title: 'O cronómetro ainda está a contar',
        body: 'Já passaram 4 horas. Queres terminar?',
        data: { url: '/hours' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    // Sem permissão de notificações o cronómetro funciona na mesma.
  }
}

export async function cancelForgottenTimerReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER);
  } catch {
  }
}
