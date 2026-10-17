import { getTableName, is } from 'drizzle-orm';
import { getTableConfig, SQLiteTable } from 'drizzle-orm/sqlite-core';
import { db } from '../db';
import * as schema from '../schemas';

const INSERT_VARIABLES_LIMIT = 900;

export type BackupRow = Record<string, unknown>;

export type BackupTables = Record<string, BackupRow[]>;

function sortByDependencies(tables: SQLiteTable[]): SQLiteTable[] {
  const sorted: SQLiteTable[] = [];
  const visiting = new Set<SQLiteTable>();

  const visit = (table: SQLiteTable) => {
    if (sorted.includes(table) || visiting.has(table)) return;
    visiting.add(table);
    for (const foreignKey of getTableConfig(table).foreignKeys) {
      const parent = foreignKey.reference().foreignTable;
      if (parent !== table && tables.includes(parent)) visit(parent);
    }
    visiting.delete(table);
    sorted.push(table);
  };

  tables.forEach(visit);
  return sorted;
}

const TABLES = sortByDependencies(
  (Object.values(schema) as unknown[]).filter((value): value is SQLiteTable =>
    is(value, SQLiteTable)
  )
);

const TABLE_NAMES: ReadonlySet<string> = new Set(TABLES.map((table) => getTableName(table)));

function chunk(rows: BackupRow[], columns: number): BackupRow[][] {
  const size = Math.max(1, Math.floor(INSERT_VARIABLES_LIMIT / Math.max(1, columns)));
  const chunks: BackupRow[][] = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}

async function readAll(): Promise<BackupTables> {
  const tables: BackupTables = {};
  for (const table of TABLES) {
    tables[getTableName(table)] = (await db.select().from(table)) as BackupRow[];
  }
  return tables;
}

function replaceAll(tables: BackupTables): void {
  db.transaction((tx) => {
    for (const table of [...TABLES].reverse()) {
      tx.delete(table).run();
    }
    for (const table of TABLES) {
      const rows = tables[getTableName(table)] ?? [];
      const columns = getTableConfig(table).columns.length;
      for (const part of chunk(rows, columns)) {
        tx.insert(table).values(part).run();
      }
    }
  });
}

function hasTable(name: string): boolean {
  return TABLE_NAMES.has(name);
}

export const backupActions = {
  readAll,
  replaceAll,
  hasTable,
};
