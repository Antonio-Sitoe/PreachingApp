import { Model } from '@nozbe/watermelondb'
import { field, json } from '@nozbe/watermelondb/decorators'

export class Students extends Model {
  static table = 'students'
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
}

function sanitizeArray(array: string[]) {
  return Array.isArray(array) ? array.map(String) : []
}
