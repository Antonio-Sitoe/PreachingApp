import { appSchema } from '@nozbe/watermelondb'
import { UserSchema } from './User'
import { ReportSchema } from './Report'
import { VisitSchema } from './visits'
import { StudentSchema } from './students'

export const schemas = appSchema({
  version: 1,
  tables: [ReportSchema, UserSchema, StudentSchema, VisitSchema],
})
