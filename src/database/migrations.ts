import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import { schemas } from './schemas'
import { UserSchema } from './schemas/User'
import { ReportSchema } from './schemas/Report'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [ReportSchema, UserSchema],
    },
  ],
})
