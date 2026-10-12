import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, type Permission } from 'react-native';
import { canScheduleExactAlarms, openExactAlarmSettings } from '../../../modules/exact-alarm';

export type PermissionKind = 'notifications' | 'location' | 'exactAlarm';

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

function androidLocationPermission(): Permission {
  return PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
}

function fromNotificationStatus(
  settings: Notifications.NotificationPermissionsStatus
): PermissionStatus {
  if (settings.granted || settings.status === Notifications.PermissionStatus.GRANTED) {
    return 'granted';
  }
  if (!settings.canAskAgain) return 'blocked';
  return 'denied';
}

async function checkNotifications(): Promise<PermissionStatus> {
  return fromNotificationStatus(await Notifications.getPermissionsAsync());
}

async function requestNotifications(): Promise<PermissionStatus> {
  return fromNotificationStatus(await Notifications.requestPermissionsAsync());
}

async function checkLocation(): Promise<PermissionStatus> {
  const allowed = await PermissionsAndroid.check(androidLocationPermission());
  return allowed ? 'granted' : 'denied';
}

async function requestLocation(): Promise<PermissionStatus> {
  const result = await PermissionsAndroid.request(androidLocationPermission());
  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
  return 'denied';
}

async function checkExactAlarm(): Promise<PermissionStatus> {
  return canScheduleExactAlarms() ? 'granted' : 'denied';
}

/** Não há diálogo: abre "Alarmes e lembretes" e o estado só muda quando a pessoa volta. */
async function requestExactAlarm(): Promise<PermissionStatus> {
  if (canScheduleExactAlarms()) return 'granted';
  openExactAlarmSettings();
  return 'denied';
}

export async function checkPermission(kind: PermissionKind): Promise<PermissionStatus> {
  if (kind === 'notifications') return checkNotifications();
  if (kind === 'exactAlarm') return checkExactAlarm();
  return checkLocation();
}

export async function requestPermission(kind: PermissionKind): Promise<PermissionStatus> {
  if (kind === 'notifications') return requestNotifications();
  if (kind === 'exactAlarm') return requestExactAlarm();
  return requestLocation();
}

export function openAppSettings(): Promise<void> {
  return Linking.openSettings();
}
