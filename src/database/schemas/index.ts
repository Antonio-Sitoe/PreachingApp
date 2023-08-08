import { ReportSchema } from './Report'
import { appSchema } from '@nozbe/watermelondb'

export const schemas = appSchema({
  version: 1.3,
  tables: [ReportSchema],
})
