import {
  mergeNotificationPreferences,
  type NotificationPreferences,
} from '@/utils/notifications/preferences';
import { createMMKV, type MMKV } from 'react-native-mmkv';

const ONBOARDING_COMPLETED = 'onboarding.completed';
const NOTIFICATION_PREFERENCES = 'notifications.preferences';
const REPORT_LIST_GROUPED = 'reports.listGrouped';
const THEME_PREFERENCE = 'appearance.theme';

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

let storage: MMKV | null = null;

function getStorage(): MMKV {
  storage ??= createMMKV({ id: 'preaching-assistant' });
  return storage;
}

export function isOnboardingCompleted(): boolean {
  return getStorage().getBoolean(ONBOARDING_COMPLETED) === true;
}

export function completeOnboarding(): void {
  getStorage().set(ONBOARDING_COMPLETED, true);
}

export function resetOnboarding(): void {
  getStorage().remove(ONBOARDING_COMPLETED);
}

export function getNotificationPreferences(): NotificationPreferences {
  return mergeNotificationPreferences(getStorage().getString(NOTIFICATION_PREFERENCES));
}

export function setNotificationPreferences(preferences: NotificationPreferences): void {
  getStorage().set(NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
}

export function isReportListGrouped(): boolean {
  return getStorage().getBoolean(REPORT_LIST_GROUPED) === true;
}

export function setReportListGrouped(value: boolean): void {
  getStorage().set(REPORT_LIST_GROUPED, value);
}

export function getThemePreference(): ThemePreference {
  const value = getStorage().getString(THEME_PREFERENCE);
  return THEME_PREFERENCES.find((preference) => preference === value) ?? 'system';
}

export function setThemePreference(value: ThemePreference): void {
  getStorage().set(THEME_PREFERENCE, value);
}
