import { expoDb } from '@/database/db';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export function DrizzleStudio() {
  useDrizzleStudio(expoDb);
  return null;
}
