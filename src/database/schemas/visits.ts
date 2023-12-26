import { tableSchema } from '@nozbe/watermelondb'

export const VisitSchema = tableSchema({
  name: 'visits',
  columns: [
    { name: 'students_id', type: 'string' },
    { name: 'notes', type: 'string' },
    { name: 'publications', type: 'string' },
    { name: 'next_time', type: 'string' },
    { name: 'result', type: 'string' },
    { name: 'date_and_hours', type: 'string' },
    { name: 'createdAt', type: 'string' },
  ],
})