import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, type Permission } from 'react-native';

export type PermissionKind = 'notifications' | 'location';

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

export async function checkPermission(kind: PermissionKind): Promise<PermissionStatus> {
  return kind === 'notifications' ? checkNotifications() : checkLocation();
}

export async function requestPermission(kind: PermissionKind): Promise<PermissionStatus> {
  return kind === 'notifications' ? requestNotifications() : requestLocation();
}

export function openAppSettings(): Promise<void> {
  return Linking.openSettings();
}
