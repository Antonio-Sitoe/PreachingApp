import { Realm } from '@realm/react'
import { IRecord } from './Record'

export interface IMonthsProps {
  name: string
  records: IRecord[]
}

export class Month extends Realm.Object implements IMonthsProps {
  public static schema: Realm.ObjectSchema = {
    name: 'Month',
    properties: { name: 'string', records: 'Record[]' },
  }

  public name!: string
  public records!: IRecord[]
}
