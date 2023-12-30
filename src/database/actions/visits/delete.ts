import { database } from '@/database/database'
import { Visits } from '@/database/model/visits'
import { Q } from '@nozbe/watermelondb'

const RESET_ALL_VISIT_DATA = () => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Visits>('visits')

    const r = await recordCollection.query().fetch()
    r.forEach((i) => i.destroyPermanently())
  })
}

const DELETE_VISIT_BY_ID = (id: string) => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Visits>('visits')
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

export { DELETE_VISIT_BY_ID, RESET_ALL_VISIT_DATA }
