import { useOnboarding } from '@/contexts/onboarding';
import { monthlyReportNotificationManager } from '@/notifications/monthly-report';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

/**
 * Volta a agendar o lembrete do relatório ao abrir a app, ao regressar ao primeiro plano
 * e quando a configuração inicial acaba (a permissão acaba de ser dada).
 */
function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { completed } = useOnboarding();

  const sync = useCallback(() => {
    return monthlyReportNotificationManager.initializeOnAppLaunch();
  }, []);

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

export { NotificationProvider };
