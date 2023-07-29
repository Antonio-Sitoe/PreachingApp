import { Realm } from '@realm/react'

enum ProfileProps {
  'Publisher', // Publicador
  'Baptized_publisher', // batizado
  'pioneer', // pioneiro
}

interface IUser {
  id: string
  name: string
  bio: string
  avatar_image: string
  Profile: ProfileProps
}

export class User extends Realm.Object<IUser> {
  name!: string
  static schema = {
    name: 'User',
    properties: {
      _id: 'string',
      name: 'string',
      bio: 'string',
      avatar_image: 'string',
      createdAt: 'date',
      Profile: 'string',
    },
    primaryKey: '_id',
  }
}
