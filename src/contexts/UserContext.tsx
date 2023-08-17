import React, { useContext, useEffect, useState } from 'react'
import { READ_USER } from '@/database/actions/user/read'
import { IUser } from '@/@types/interfaces'

interface UserProps {
  user: IUser
  setProfileUser(user: IUser): void
}

export const UserContext = React.createContext({} as UserProps)

interface UserStorageProps {
  children: React.ReactNode
}

export function UserStorage({ children }: UserStorageProps) {
  const [user, setUser] = useState<IUser>({} as IUser)

  function setProfileUser(user: IUser) {
    setUser(user)
  }

  useEffect(() => {
    async function getUser() {
      try {
        const user = await READ_USER()
        console.log('DADOS DO USUARIO', user)
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setProfileUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const data = useContext(UserContext)

  return data
}
