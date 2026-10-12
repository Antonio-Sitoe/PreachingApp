import { requireNativeModule } from 'expo';

type ExactAlarmModule = {
  canScheduleExactAlarms(): boolean;
  openExactAlarmSettings(): void;
};

const ExactAlarm = requireNativeModule<ExactAlarmModule>('ExactAlarm');

export function canScheduleExactAlarms(): boolean {
  return ExactAlarm.canScheduleExactAlarms();
}

export function openExactAlarmSettings(): void {
  ExactAlarm.openExactAlarmSettings();
}
