import { RealmProvider } from '@realm/react'
import { ReactNode } from 'react'
import { User } from './schemas/User'

interface RealmProviderContextProps {
  children: ReactNode
}
export function RealmProviderContext({ children }: RealmProviderContextProps) {
  return (
    <RealmProvider schema={[User]} path="preaching_app">
      {children}
    </RealmProvider>
  )
}
