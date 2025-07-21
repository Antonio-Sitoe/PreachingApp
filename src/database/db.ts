import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schemas';

export const expoDb = SQLite.openDatabaseSync('preachingDB.sqlite');

export const db = drizzle(expoDb, { schema });
