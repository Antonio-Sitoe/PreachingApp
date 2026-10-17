import { usageActions } from '@/database/actions';
import type { UsageEvent } from '@/database/schemas';
import { isUsageCountingEnabled } from '@/utils/storage';

export async function countEvent(event: UsageEvent): Promise<void> {
  if (!isUsageCountingEnabled()) return;
  try {
    await usageActions.increment(event);
  } catch (error) {
    console.error('Error counting usage event:', error);
  }
}
