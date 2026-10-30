import { backupActions } from '@/database/actions';
import * as Notifications from 'expo-notifications';
import { discardTimer } from '../../../modules/timer-notification';
import { disableLock } from './index';

export async function wipeLocalData(): Promise<void> {
  backupActions.replaceAll({});
  await disableLock();
  discardTimer();
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
  }
}
