import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { PUBLISHER_TYPES, SYNC_STATUSES } from './users';

export const monthlyReports = sqliteTable(
  'monthly_reports',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuid()),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    publisherType: text('publisher_type', { enum: PUBLISHER_TYPES }),
    // Vazio enquanto o utilizador não corrige: vale o que se calcula das visitas.
    participated: integer('participated', { mode: 'boolean' }),
    bibleStudies: integer('bible_studies'),
    // Horas inteiras enviadas, guardadas só ao enviar.
    hours: integer('hours'),
    sentAt: text('sent_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    syncStatus: text('sync_status', { enum: SYNC_STATUSES }).notNull().default('pending'),
  },
  (table) => [uniqueIndex('monthly_reports_year_month_idx').on(table.year, table.month)]
);

export type MonthlyReport = typeof monthlyReports.$inferSelect;
export type NewMonthlyReport = typeof monthlyReports.$inferInsert;
