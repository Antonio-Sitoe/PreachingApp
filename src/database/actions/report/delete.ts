import { database } from '@/database/database'
import { Report } from '@/database/model/Report'

const RESET_ALL_REPORT_DATA = () => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')

    const r = await recordCollection.query().fetch()
    r.forEach((i) => i.destroyPermanently())
  })
}

export { RESET_ALL_REPORT_DATA }
