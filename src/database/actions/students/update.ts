import type { IStudentsBody } from '@/@types/interfaces'
import { database } from '@/database/database'
import type { Students } from '@/database/model/students'
import { Q } from '@nozbe/watermelondb'

const UPDATE_STUDENTS_BY_ID = (id: string, data: IStudentsBody) => {
  return database.write(async () => {
    const colletion = database.collections.get<Students>('students')
    // Verifique se já existe um registro para a data especificada no mês
    const student_by_id = await colletion.query(Q.where('id', id)).fetch()
    console.log('student', student_by_id.length)
    if (student_by_id.length === 0 && student_by_id[0].id !== id)
      return {
        data: {},
      }

    const studentData = student_by_id[0]
    studentData.update((student) => {
      student.about = `${data.about}`
      student.address = `${data.address}`
      student.age = data.age
      student.best_day = data.best_day
      student.best_time = data.best_time
      student.email = data.email
      student.gender = data.gender
      student.name = data.name
      student.telephone = `${data.telephone}`
    })
    return colletion.find(id)
  })
}

export { UPDATE_STUDENTS_BY_ID }
