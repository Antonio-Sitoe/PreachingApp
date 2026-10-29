import { requireNativeModule } from 'expo';

type EventSubscription = { remove(): void };

export type TimerStatus = 'idle' | 'running' | 'paused';

export type TimerState = {
  status: TimerStatus;
  startedAt: number;
  resumedAt: number;
  accumulatedMs: number;
};

export type TimerSession = {
  startedAt: number;
  elapsedMs: number;
};

type TimerNotificationModule = {
  getState(): TimerState;
  start(openUrl: string | null): TimerState;
  pause(): TimerState;
  resume(): TimerState;
  finish(): TimerSession | null;
  discard(): void;
  refresh(): void;
  canNotify(): boolean;
  takePending(): TimerSession[];
  addListener(event: 'onChange', listener: (state: TimerState) => void): EventSubscription;
};

const TimerNotification = requireNativeModule<TimerNotificationModule>('TimerNotification');

export function elapsedMs(state: TimerState, now = Date.now()): number {
  return state.accumulatedMs + (state.status === 'running' ? now - state.resumedAt : 0);
}

export const getTimerState = () => TimerNotification.getState();
export const startTimer = (openUrl: string | null) => TimerNotification.start(openUrl);
export const pauseTimer = () => TimerNotification.pause();
export const resumeTimer = () => TimerNotification.resume();
export const finishTimer = () => TimerNotification.finish();
export const discardTimer = () => TimerNotification.discard();
export const refreshTimerNotification = () => TimerNotification.refresh();
export const canShowTimerNotification = () => TimerNotification.canNotify();
export const takePendingSessions = () => TimerNotification.takePending();

export function addTimerListener(listener: (state: TimerState) => void): EventSubscription {
  return TimerNotification.addListener('onChange', listener);
}
