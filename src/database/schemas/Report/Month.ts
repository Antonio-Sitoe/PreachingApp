import { tableSchema } from '@nozbe/watermelondb'

export const MonthSchema = tableSchema({
  name: 'months',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'year_id', type: 'string', isIndexed: true },
    { name: 'createdAt', type: 'string' },
  ],
})
