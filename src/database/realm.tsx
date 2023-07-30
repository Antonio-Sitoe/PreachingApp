import { ReactNode } from 'react'
import { User } from './schemas/User'
import { Month } from './schemas/Report/Month'
import { Report } from './schemas/Report/Report'
import { Record } from './schemas/Report/Record'
import { RealmProvider } from '@realm/react'

const schema = [User, Report, Month, Record]

interface RealmProviderContextProps {
  children: ReactNode
}
export function RealmProviderContext({ children }: RealmProviderContextProps) {
  return (
    <RealmProvider schema={schema} path="preaching_app" inMemory={true}>
      {children}
    </RealmProvider>
  )
}
