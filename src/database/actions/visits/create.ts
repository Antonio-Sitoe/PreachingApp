import { VisiteProps } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Students } from '@/database/model/students'
import { Visits } from '@/database/model/visits'

const CREATE_VISIT_BY_STUDENT_ID = (data: VisiteProps) => {
  return database.write(async () => {
    const colletion = database.collections.get<Students>('students')
    const student_by_id = await colletion.find(data.students_id)
    const collection = database.collections.get<Visits>('visits')
    const newVisit = await collection.create((visita: Visits) => {
      visita.biblical_texts = `${data.biblical_texts}`
      visita.date_and_hours = data.date_and_hours
      visita.notes = data.notes
      visita.publications = data.publications
      visita.result = data.result
      visita.students.set(student_by_id)
      visita.videos = data.videos
    })
    return newVisit
  })
}

export { CREATE_VISIT_BY_STUDENT_ID }
