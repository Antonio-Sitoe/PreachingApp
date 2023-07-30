import { Realm } from '@realm/react'

// Definir as interfaces para os tipos de dados
export interface IRecord {
  _id: string
  date: Date
  hours: number
  publications: number
  videos: number
  returnVisits: number
  students: number
  comments?: string
}

export class Record extends Realm.Object implements IRecord {
  public static schema: Realm.ObjectSchema = {
    name: 'Record',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      date: 'date',
      hours: 'int',
      publications: 'int',
      videos: 'int',
      returnVisits: 'int',
      students: 'int',
      comments: 'string',
    },
  }

  public _id!: string
  public date!: Date
  public hours!: number
  public publications!: number
  public videos!: number
  public returnVisits!: number
  public students!: number
  public comments: string | undefined
}
