import { tableSchema } from '@nozbe/watermelondb'

export const YearSchema = tableSchema({
  name: 'years',
  columns: [
    {
      name: 'year',
      type: 'string',
    },
  ],
})
