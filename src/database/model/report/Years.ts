import { Model } from '@nozbe/watermelondb'
import { field, children } from '@nozbe/watermelondb/decorators'
import { Month } from './Month'

export class Year extends Model {
  static table = 'years'

  @field('year')
  year!: string

  @children('months') months!: Month[]
}
