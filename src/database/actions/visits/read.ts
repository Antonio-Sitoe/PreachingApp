import { database } from '@/database/database'
import { Visits } from '@/database/model/visits'
import { stringToDate } from '@/utils/dates'
import { Q } from '@nozbe/watermelondb'

async function GET_VISITS(_id: string) {
  const colletion = database.collections.get<Visits>('visits')
  const visits = await colletion.query(Q.where('students_id', _id)).fetch()

  return { visits }
}
async function GET_VISIT_BY_ID(_id: string) {
  const collectionVisits = database.collections.get<Visits>('visits')
  const visitsData = await collectionVisits
    .query(Q.where('students_id', _id))
    .fetch()

  const Visits = visitsData
    .map((item) => {
      return {
        id: item.id,
        biblical_texts: item.biblical_texts,
        date_and_hours: stringToDate(item.date_and_hours),
        notes: item.notes,
        publications: item.publications,
        result: item.result,
        students_id: item.students,
        videos: item.videos,
      }
    })
    .sort((a: any, b: any) => b.date_and_hours - a.date_and_hours)

  return { visits: Visits }
}

export { GET_VISITS, GET_VISIT_BY_ID }
