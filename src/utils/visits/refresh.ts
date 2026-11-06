import { queryKeys } from '@/constants/query-keys';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import type { QueryClient } from '@tanstack/react-query';

/** Depois de mudar visitas ou marcações: actualiza os ecrãs e volta a agendar os lembretes. */
export async function refreshVisitData(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.students.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.visits.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.milestones.all }),
  ]);
  void syncAllNotifications();
}
