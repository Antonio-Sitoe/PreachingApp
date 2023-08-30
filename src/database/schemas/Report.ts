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

    { name: 'createdAt', type: 'string' },

    { name: 'day', type: 'number' },
    { name: 'month', type: 'string' },
    { name: 'year', type: 'number' },
  ],
})
