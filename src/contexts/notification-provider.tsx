import { useOnboarding } from '@/contexts/onboarding';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

/**
 * Volta a agendar todas as notificações ao abrir a app, ao regressar ao primeiro plano
 * (por exemplo, depois de mexer em "Alarmes e lembretes") e quando a configuração inicial acaba.
 */
function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { completed } = useOnboarding();

  const sync = useCallback(() => syncAllNotifications(), []);

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
