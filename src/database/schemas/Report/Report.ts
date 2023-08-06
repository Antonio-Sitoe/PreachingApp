import { tableSchema } from '@nozbe/watermelondb'

export const ReportSchema = tableSchema({
  name: 'reports',
  columns: [
    { name: 'date', type: 'string' },
    { name: 'hours', type: 'number' },
    { name: 'minutes', type: 'number' },
    { name: 'publications', type: 'number' },
    { name: 'videos', type: 'number' },
    { name: 'returnVisits', type: 'number' },
    { name: 'students', type: 'number' },
    { name: 'comments', type: 'string' },
    { name: 'month_id', type: 'string', isIndexed: true },
    { name: 'createdAt', type: 'string' },
  ],
})
