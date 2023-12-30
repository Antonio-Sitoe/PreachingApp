import { Model } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { field, relation } from '@nozbe/watermelondb/decorators'

export class Visits extends Model {
  static table = 'visits'

  static associations: Associations = {
    students: { type: 'belongs_to', key: 'students_id' },
  }

  @relation('students', 'students_id') students
  @field('notes') notes!: string
  @field('publications') publications!: string
  @field('biblical_texts') biblical_texts!: string
  @field('next_time') next_time!: string
  @field('videos') videos!: string
  @field('result') result!: string
  @field('date_and_hours') date_and_hours!: Date | string
  @field('createdAt') createdAt!: Date | string
}
