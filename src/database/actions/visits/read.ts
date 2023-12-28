import { database } from '@/database/database'
import { Visits } from '@/database/model/visits'
import { Q } from '@nozbe/watermelondb'

async function GET_VISITS(_id: string) {
  const colletion = database.collections.get<Visits>('visits')
  const visits = await colletion.query(Q.where('students_id', _id)).fetch()

  return { visits }
}

export { GET_VISITS }
