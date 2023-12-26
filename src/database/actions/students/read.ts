import { database } from '@/database/database'
import { Students } from '@/database/model/students'

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

export { GET_STUDENT_DATA }
