import { backupActions } from '@/database/actions';
import * as Notifications from 'expo-notifications';
import { discardTimer } from '../../../modules/timer-notification';
import { disableLock } from './index';

// PIN esquecido: apaga tudo o que está neste telemóvel para se poder restaurar uma cópia.
export async function wipeLocalData(): Promise<void> {
  backupActions.replaceAll({});
  await disableLock();
  discardTimer();
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
  }
}
