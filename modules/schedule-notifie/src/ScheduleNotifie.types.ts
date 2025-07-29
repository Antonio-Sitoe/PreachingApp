import type { StyleProp, ViewStyle } from 'react-native';

export type BootEventPayload = {
  restoredCount: number;
  message: string;
};

export type ScheduleNotifieModuleEvents = {
  onBootCompleted: (params: BootEventPayload) => void;
};
