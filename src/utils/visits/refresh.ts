import { syncAllNotifications } from '@/utils/notifications/scheduler';
import type { QueryClient } from '@tanstack/react-query';

/** Depois de mudar visitas ou marcações: actualiza os ecrãs e volta a agendar os lembretes. */
export async function refreshVisitData(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['students'] }),
    queryClient.invalidateQueries({ queryKey: ['visits'] }),
    queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    queryClient.invalidateQueries({ queryKey: ['lessons'] }),
    queryClient.invalidateQueries({ queryKey: ['milestones'] }),
  ]);
  void syncAllNotifications();
}
