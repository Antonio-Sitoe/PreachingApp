import { STUDENT_SORTS, type StudentSort } from '@/constants/students';
import {
  mergeNotificationPreferences,
  type NotificationPreferences,
} from '@/utils/notifications/preferences';
import { createMMKV, type MMKV } from 'react-native-mmkv';

const ONBOARDING_COMPLETED = 'onboarding.completed';
const NOTIFICATION_PREFERENCES = 'notifications.preferences';
const REPORT_LIST_GROUPED = 'reports.listGrouped';
const THEME_PREFERENCE = 'appearance.theme';
const LIST_VIEW = 'appearance.listView';
const LAST_BACKUP = 'backup.last';
const USAGE_COUNTING = 'usage.countingEnabled';
const STUDENT_SORT = 'students.sort';

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const LIST_VIEWS = ['list', 'cards'] as const;
export type ListView = (typeof LIST_VIEWS)[number];

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

export function getListView(): ListView {
  const value = getStorage().getString(LIST_VIEW);
  return LIST_VIEWS.find((view) => view === value) ?? 'list';
}

export function setListView(value: ListView): void {
  getStorage().set(LIST_VIEW, value);
}

export type LastBackup = {
  createdAt: string;
  counts: Record<string, number>;
};

export function getLastBackup(): LastBackup | null {
  const raw = getStorage().getString(LAST_BACKUP);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LastBackup;
    return typeof parsed.createdAt === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function setLastBackup(value: LastBackup): void {
  getStorage().set(LAST_BACKUP, JSON.stringify(value));
}

export function isUsageCountingEnabled(): boolean {
  return getStorage().getBoolean(USAGE_COUNTING) === true;
}

export function setUsageCountingEnabled(value: boolean): void {
  getStorage().set(USAGE_COUNTING, value);
}

export function getStudentSort(): StudentSort {
  const value = getStorage().getString(STUDENT_SORT);
  return STUDENT_SORTS.find((option) => option.id === value)?.id ?? 'next-visit';
}

export function setStudentSort(value: StudentSort): void {
  getStorage().set(STUDENT_SORT, value);
}
