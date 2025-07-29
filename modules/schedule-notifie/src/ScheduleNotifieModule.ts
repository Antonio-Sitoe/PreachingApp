import { NativeModule, requireNativeModule } from 'expo';

import type { ScheduleNotifieModuleEvents } from './ScheduleNotifie.types';

declare class ScheduleNotifieModule extends NativeModule<ScheduleNotifieModuleEvents> {
  /**
   * Força a restauração de notificações (para teste)
   */
  forceRestoreNotifications(): Promise<number>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ScheduleNotifieModule>('ScheduleNotifie');
