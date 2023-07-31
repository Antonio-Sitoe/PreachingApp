import { Model } from '@nozbe/watermelondb'
import { field, children } from '@nozbe/watermelondb/decorators'
import { Month } from './Month'
import { Associations } from '@nozbe/watermelondb/Model'

export class Year extends Model {
  static table = 'years'
  static associations: Associations = {
    months: { type: 'has_many', foreignKey: 'year_id' },
  }

  @field('year')
  year!: string

  @children('months') months!: Month[]
}
