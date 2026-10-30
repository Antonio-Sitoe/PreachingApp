import { useOnboarding } from '@/contexts/onboarding';
import { useTimerSync } from '@/hooks/use-timer';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { isVisitReminder } from '@/utils/notifications/visit-reminders';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { completed } = useOnboarding();

  const sync = useCallback(() => syncAllNotifications(), []);

  useTimerSync(completed);
  useOpenFromNotification(completed);

  useEffect(() => {
    if (!completed) return;
    sync();
  }, [completed, sync]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && completed) sync();
    });
    return () => subscription.remove();
  }, [completed, sync]);

  return children;
}

/** Tocar num lembrete de visita abre a ficha do estudante, também quando a app estava fechada. */
function useOpenFromNotification(ready: boolean) {
  const lastResponse = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !lastResponse) return;
    const id = lastResponse.notification.request.identifier;
    if (handled.current === id) return;
    handled.current = id;
    const data = lastResponse.notification.request.content.data;
    if (isVisitReminder(data)) router.push(`/student/${data.studentId}`);
  }, [ready, lastResponse]);
}

export { NotificationProvider };
