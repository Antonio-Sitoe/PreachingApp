import { tableSchema } from '@nozbe/watermelondb'

export const UserSchema = tableSchema({
  name: 'user',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'avatar_image', type: 'string' },
    { name: 'profile', type: 'string' },
    { name: 'createdAt', type: 'string' },
  ],
})
