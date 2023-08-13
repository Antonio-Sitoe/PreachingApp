import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export class Report extends Model {
  static table = 'reports'
  @field('hours') hours!: number
  @field('minutes') minutes!: number
  @field('publications') publications!: number
  @field('videos') videos!: number
  @field('returnVisits') returnVisits!: number
  @field('students') students!: number
  @field('comments') comments!: string

  @field('day') day!: number
  @field('month') month!: string
  @field('year') year!: number

  @field('date') date!: Date | string
  @field('createdAt') createdAt!: Date | string
}
