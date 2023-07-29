import { Realm } from '@realm/react'
import { IMonthsProps } from './Month'

export interface IReport {
  year: string
  months: IMonthsProps[]
}

// Report[](array de anos) -> Month[](array de meses de um ano) -> Record[](array de relatorios de varios meses)
export class Report extends Realm.Object implements IReport {
  public static schema: Realm.ObjectSchema = {
    name: 'Report',
    primaryKey: 'year',
    properties: { year: 'string', months: 'Month[]' },
  }

  public year!: string
  public months!: IMonthsProps[]
}
