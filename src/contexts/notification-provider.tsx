import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { monthlyReportNotificationManager } from '@/services/notifications/monthly-report-notification-manager';

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeNotifications = useCallback(async () => {
    try {
      await monthlyReportNotificationManager.initializeOnAppLaunch();
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  }, []);

  const handleAppStateChange = useCallback(async (nextAppState: string) => {
    if (nextAppState === 'active') {
      try {
        await monthlyReportNotificationManager.initializeOnAppLaunch();
      } catch (error) {
        console.error('Erro ao re-sincronizar notificações:', error);
      }
    }
  }, []);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  return <>{children}</>;
}
