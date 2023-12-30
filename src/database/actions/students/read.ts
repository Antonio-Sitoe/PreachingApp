import { IStudentsBody, VisiteProps } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Students } from '@/database/model/students'
import { Visits } from '@/database/model/visits'
import { Q } from '@nozbe/watermelondb'

export interface IStudentsBodyHelper extends IStudentsBody {
  visits: VisiteProps[]
}

async function GET_STUDENT_DATA() {
  const studentsData = database.collections.get<Students>('students')
  const students = await studentsData.query().fetch()

  const studentsMap = students.map((item) => {
    return {
      id: item?.id,
      name: item?.name,
      address: item?.address,
      gender: item?.gender,
    }
  })

  return studentsMap
}

async function GET_STUDENTS_BY_ID(_id: string) {
  const colletion = database.collections.get<Students>('students')

  const student_by_id = await colletion.query(Q.where('id', _id)).fetch()

  if (student_by_id.length === 0) {
    return {
      data: {},
    }
  }

  const profileData = student_by_id.reduce((acc, item: any) => {
    acc.id = item.id
    acc.about = `${item.about}`
    acc.address = `${item.address}`
    acc.age = `${item.age}`
    acc.best_day = item.best_day
    acc.best_time = item.best_time
    acc.email = item.email
    acc.gender = item.gender
    acc.name = item.name
    acc.telephone = item.telephone || ''
    return acc
  }, {} as IStudentsBodyHelper)

  return { data: profileData }
}

export { GET_STUDENT_DATA, GET_STUDENTS_BY_ID }
