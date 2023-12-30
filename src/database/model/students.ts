import { Model } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, field, json } from '@nozbe/watermelondb/decorators'

export class Students extends Model {
  static table = 'students'

  static associations: Associations = {
    visits: { type: 'has_many', foreignKey: 'students_id' },
  }

  @field('name') name!: string
  @field('age') age!: string
  @field('about') about!: string
  @field('telephone') telephone!: string
  @field('email') email!: string
  @field('gender') gender!: string
  @field('address') address!: string
  @json('best_time', sanitizeArray) best_time: string[] | undefined
  @json('best_day', sanitizeArray) best_day: string[] | undefined
  @field('createdAt') createdAt!: Date | string

  @children('visits') visits: any
}

function sanitizeArray(array: string[]) {
  return Array.isArray(array) ? array.map(String) : []
}
