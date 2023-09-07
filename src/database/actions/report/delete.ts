import { database } from '@/database/database'
import { Report } from '@/database/model/Report'
import { Q } from '@nozbe/watermelondb'

const RESET_ALL_REPORT_DATA = () => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')

    const r = await recordCollection.query().fetch()
    r.forEach((i) => i.destroyPermanently())
  })
}

const DELETE_REPORT_BY_ID = (id: string) => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')
    const report = await recordCollection.query(Q.where('id', id)).fetch()

    if (report.length > 0) {
      report[0].destroyPermanently()
      return {
        sucess: true,
      }
    }
    return {
      sucess: false,
    }
  })
}

export { RESET_ALL_REPORT_DATA, DELETE_REPORT_BY_ID }
