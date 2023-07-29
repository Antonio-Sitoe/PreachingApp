import { Realm, useQuery } from '@realm/react'
import { string, date } from 'zod'

interface IReport {
  _id: string
  date: Date
  hours: number
  hopublicationsrs: number
  videos: number
  returnVisits: number
  students: number
  comments: string
}

export class Report extends Realm.Object<IReport> {
  static schema = {
    name: 'Report',
    primaryKey: '_id',
    properties: {
      _id: 'string',
    },
  }
}
// Definir as interfaces para os tipos de dados

interface ReportProps {
  year: string
  months: Month[]
}

interface Month {
  name: string
  records: Record[]
}

interface Record {
  _id: string
  date: Date
  userId: string
  hours: number
  publications: number
  videos: number
  returnVisits: number
  students: number
  comments: string
}

// Definir as classes que estendem a classe Realm.Object

class Report extends Realm.Object implements Report {
  public static schema: Realm.ObjectSchema = {
    name: 'Report',
    primaryKey: 'year',
    properties: { year: 'string', months: 'Month[]' },
  }

  public year!: string
  public months!: Month[]
}

class Month extends Realm.Object implements Month {
  public static schema: Realm.ObjectSchema = {
    name: 'Month',
    properties: { name: 'string', records: 'Record[]' },
  }

  public name!: string
  public records!: Record[]
}

class Record extends Realm.Object implements Record {
  public static schema: Realm.ObjectSchema = {
    name: 'Record',
    properties: {
      _id: 'string',
      date: 'date',
      userId: 'string',
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
  public userId!: string
  public hours!: number
  public publications!: number
  public videos!: number
  public returnVisits!: number
  public students!: number
  public comments!: string
}

// Criar uma instância do RealmDB com o esquema definido
const realm = new Realm({ schema: [Report, Month, Record] })

// const schema = [
//   {
//     name: 'Report',
//     primaryKey: 'year',
//     properties: { year: 'string', months: 'Month[]' },
//   },
//   {
//     name: 'Month',
//     properties: { name: 'string', records: 'Record[]' },
//   },
//   {
//     name: 'Record',
//     properties: {
//       _id: 'string',
//       date: 'date',
//       userId: 'string',
//       hours: 'int',
//       publications: 'int',
//       videos: 'int',
//       returnVisits: 'int',
//       students: 'int',
//       comments: 'string',
//     },
//   },
// ];

//  February March April May June July August September October November December
