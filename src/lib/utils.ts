import { Platform } from 'react-native';

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(Platform.OS === 'web' ? ' ' : '');
}
