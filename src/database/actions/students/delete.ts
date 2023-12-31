import { database } from '@/database/database'
import { Students } from '@/database/model/students'
import { Visits } from '@/database/model/visits'
import { Q } from '@nozbe/watermelondb'

const DELETE_STUDENT_WITH_OWN_VISITS = (id: string) => {
  return database.write(async () => {
    const Student_collection = database.collections.get<Students>('students')
    const students = await Student_collection.query(Q.where('id', id)).fetch()

    if (students.length === 0)
      return {
        sucess: false,
      }

    const current_student = students[0]

    const collectionVisits = database.collections.get<Visits>('visits')
    const visits = await collectionVisits
      .query(Q.where('students_id', id))
      .fetch()

    for await (const V of visits) {
      if (
        current_student.id === id &&
        id === V?.students._model._raw.students_id
      ) {
        console.log('APAGANDO VISITA')
        V.destroyPermanently()
      }
    }

    const haveVisits = await collectionVisits
      .query(Q.where('students_id', id))
      .fetch()

    if (haveVisits.length === 0) {
      console.log('Apagando usuario', haveVisits.length)
      current_student.destroyPermanently()
      return {
        sucess: true,
      }
    }

    return {
      sucess: false,
    }
  })
}

export { DELETE_STUDENT_WITH_OWN_VISITS }
