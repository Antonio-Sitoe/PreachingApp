import { IUser } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Students } from '@/database/model/students'
import { User } from '@/database/model/user'

const CREATE_STUDENTS = (data: IUser) => {
  return database.write(async () => {
    const userGet = database.collections.get<Students>('students')
    const userExist = await userGet.query().fetch()

    if (userExist.length > 0) {
      const userUpdated = await userExist[0].update((user: any) => {
        user.name = data.name
        user.email = data.email
        user.avatar_image = data.avatar_image
        user.profile = data.profile
        user.createdAt = `${new Date()}`
      })
      return userUpdated
    } else {
      const newUser = await userGet.create((user: any) => {
        user.name = data.name
        user.email = data.email
        user.avatar_image = data.avatar_image
        user.profile = data.profile
        user.createdAt = `${new Date()}`
      })
      return newUser
    }
  })
}

export { CREATE_STUDENTS }
