import { IStudentsBody } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Students } from '@/database/model/students'

const CREATE_STUDENTS = (data: IStudentsBody) => {
  return database.write(async () => {
    const StudentsCollection = database.collections.get<Students>('students')

    const newStudents = await StudentsCollection.create(
      (stundent: Students) => {
        stundent.about = `${data.about}`
        stundent.address = `${data.address}`
        stundent.age = data.age
        stundent.best_day = data.best_day
        stundent.best_time = data.best_time
        stundent.email = data.email
        stundent.gender = data.gender
        stundent.name = data.name
        stundent.telephone = `${data.telephone}`
      },
    )

    return newStudents
  })
}

export { CREATE_STUDENTS }
