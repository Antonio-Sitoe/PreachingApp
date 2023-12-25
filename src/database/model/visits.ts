import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export class Visits extends Model {
  static table = 'user'
  @relation('students', 'students_id') students_id!: string
  @field('notes') notes!: string
  @field('publications') publications!: string
  @field('next_time') next_time!: string
  @field('result') result!: string
  @field('date_and_hours') date_and_hours!: Date | string
  @field('createdAt') createdAt!: Date | string
}
