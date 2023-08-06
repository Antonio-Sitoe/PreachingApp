import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schemas } from './schemas'
import { model } from './model'

const adapter = new SQLiteAdapter({
  dbName: 'preachingDB',
  schema: schemas,
})

export const database = new Database({
  adapter,
  modelClasses: model,
})
