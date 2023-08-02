import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Report } from '@/database/model/report/Report'
import { Year } from '@/database/model/report/Years'

const RESET_ALL_REPORT_DATA = () => {
  return database.write(async () => {
    const yearColletion = database.collections.get<Year>('years')
    const monthCollection = database.collections.get<Month>('months')
    const recordCollection = database.collections.get<Report>('reports')

    const y = await yearColletion.query().fetch()
    y.forEach((i) => i.destroyPermanently())

    const m = await monthCollection.query().fetch()
    m.forEach((i) => i.destroyPermanently())

    const r = await recordCollection.query().fetch()
    r.forEach((i) => i.destroyPermanently())
    await monthCollection.query().fetch()
  })
}

export { RESET_ALL_REPORT_DATA }
