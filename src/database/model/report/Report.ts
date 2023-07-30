import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'
import { Month } from './Month'

export class Report extends Model {
  static table = 'reports'

  @field('date') date!: Date
  @field('hours') hours!: number
  @field('minutes') minutes!: number
  @field('publications') publications!: number
  @field('videos') videos!: number
  @field('returnVisits') returnVisits!: number
  @field('students') students!: number
  @field('comments') comments!: string

  @relation('months', 'month_id') month!: Month
}
