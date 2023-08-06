import { Model } from '@nozbe/watermelondb'
import { field, children, relation } from '@nozbe/watermelondb/decorators'
import { Year } from './Years'
import { Report } from './Report'
import { Associations } from '@nozbe/watermelondb/Model'

export class Month extends Model {
  static table = 'months'
  static associations: Associations = {
    reports: { type: 'has_many', foreignKey: 'month_id' },
  }

  @field('name') name!: string
  @relation('years', 'year_id') year!: Year
  @children('reports') reports!: Report[]
  @field('createdAt') createdAt!: Date | string
}
