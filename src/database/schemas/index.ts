import { YearSchema } from './Report/Year'
import { MonthSchema } from './Report/Month'
import { ReportSchema } from './Report/Report'
import { appSchema } from '@nozbe/watermelondb'

export const schemas = appSchema({
  version: 1,
  tables: [ReportSchema, YearSchema, MonthSchema],
})
