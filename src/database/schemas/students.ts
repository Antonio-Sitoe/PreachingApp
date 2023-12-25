import { tableSchema } from '@nozbe/watermelondb'

export const StudentSchema = tableSchema({
  name: 'students',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'age', type: 'number' },
    { name: 'about', type: 'string' },
    { name: 'telephone', type: 'number', isOptional: true },
    { name: 'email', type: 'string', isOptional: true },
    { name: 'gender', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'best_time', type: 'string' },
    { name: 'best_day', type: 'string' },
    { name: 'language', type: 'string' },
    { name: 'createdAt', type: 'string' },
  ],
})
