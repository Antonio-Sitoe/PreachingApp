import { IStudentsBody, VisiteProps } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Visits } from '@/database/model/visits'
import { Q } from '@nozbe/watermelondb'

const UPDATE_VISIT_BY_STUDENT_ID_AND_VISI_ID = (
  id: string,
  data: VisiteProps,
) => {
  return database.write(async () => {
    const colletion = database.collections.get<Visits>('visits')

    const visit_id = await colletion.query(Q.where('id', id)).fetch()

    if (visit_id.length === 0 && visit_id[0].id !== id) return {}

    const visit_data = visit_id[0]
    visit_data.update((visit) => {
      visit.biblical_texts = `${data.biblical_texts}`
      visit.date_and_hours = `${data.date_and_hours}`
      visit.notes = data.notes
      visit.publications = data.publications
      visit.result = data.result
      visit.videos = data.videos
    })

    return colletion.find(id)
  })
}

export { UPDATE_VISIT_BY_STUDENT_ID_AND_VISI_ID }
