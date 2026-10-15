import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schemas';

export const expoDb = openDatabaseSync('preachingDB.sqlite');

export const db = drizzle(expoDb, { schema });
