import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Report } from '@/database/model/report/Report'
import { Year } from '@/database/model/report/Years'

const READ_ALL_REPORT_DATA = async () => {
  const yearColletion = database.collections.get<Year>('years')
  const monthCollection = database.collections.get<Month>('months')
  const recordCollection = database.collections.get<Report>('reports')

  const y = await yearColletion.query().fetch()
  console.log('anos', y.length)
  const m = await monthCollection.query().fetch()
  console.log('MESES', m.length)
  const r = await recordCollection.query().fetch()
  console.log('relatorios', r.length)
}

export { READ_ALL_REPORT_DATA }
