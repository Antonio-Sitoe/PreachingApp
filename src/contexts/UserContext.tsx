import React, { useContext, useEffect, useState } from 'react';
import { type User, usersActions } from '@/database/actions';

interface UserProps {
  user: User;
  setProfileUser(user: User): void;
}

export const UserContext = React.createContext({} as UserProps);

interface UserStorageProps {
  children: React.ReactNode;
}

export function UserStorage({ children }: UserStorageProps) {
  const [user, setUser] = useState<User>({} as User);

  function setProfileUser(user: User) {
    setUser(user);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const user = await usersActions.getAllUsers()?.[0];
        console.log('DADOS DO USUARIO', user);
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setProfileUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const data = useContext(UserContext);

  return data;
};
