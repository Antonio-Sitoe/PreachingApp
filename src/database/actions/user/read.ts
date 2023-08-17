import { database } from '@/database/database'
import { User } from '@/database/model/user'

const READ_USER = async () => {
  const userColletion = database.collections.get<User>('user')
  const userExist = await userColletion.query().fetch()

  if (userExist.length)
    return {
      id: userExist[0].id,
      name: userExist[0].name,
      profile: userExist[0].profile,
      email: userExist[0].email,
      avatar_image: userExist[0].avatar_image,
    }
  return {
    id: '',
    name: '',
    profile: '',
    email: '',
    avatar_image: '',
  }
}
export { READ_USER }
