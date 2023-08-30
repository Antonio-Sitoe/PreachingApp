import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export class User extends Model {
  static table = 'user'
  @field('name') name!: string
  @field('email') email!: string
  @field('avatar_image') avatar_image!: string
  @field('profile') profile!: string
  @field('createdAt') createdAt!: Date | string
}
