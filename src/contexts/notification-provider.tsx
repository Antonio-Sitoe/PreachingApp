import { useOnboarding } from '@/contexts/onboarding';
import { useTimerSync } from '@/hooks/use-timer';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { completed } = useOnboarding();

  const sync = useCallback(() => syncAllNotifications(), []);

  useTimerSync(completed);

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
