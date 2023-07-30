import { Model } from '@nozbe/watermelondb'
import { field, children, relation } from '@nozbe/watermelondb/decorators'
import { Year } from './Years'
import { Report } from './Report'

export class Month extends Model {
  static table = 'months'

  @field('name') name!: string

  @relation('years', 'year_id') year!: Year

  @children('records') records!: Report[]
}
