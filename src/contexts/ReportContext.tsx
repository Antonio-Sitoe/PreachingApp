import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Year } from '@/database/model/report/Years'
import { createYearsAndMonthForCurrentDate } from '@/database/actions/report/create'
import { Q } from '@nozbe/watermelondb'
import React, { useContext, useEffect, useState } from 'react'

interface currentYearProps {
  id: string
  year: string
}
interface currentMonthProps {
  id: string
  name: string
}
interface ReportContextPros {
  currentYear: currentYearProps | null
  currentMonth: currentMonthProps | null
}
export const ReportContext = React.createContext({} as ReportContextPros)

interface ReportStorageProps {
  children: React.ReactNode
}

export function ReportStorage({ children }: ReportStorageProps) {
  const [currentYear, SetCurrentYear] = useState<currentYearProps | null>(null)
  const [currentMonth, SetCurrentMonth] = useState<currentMonthProps | null>(
    null,
  )

  useEffect(() => {
    createYearsAndMonthForCurrentDate().then(
      ({ currentYearReport, currentMonthReport }: any) => {
        console.log('ANO GLOBAL', currentYearReport)
        console.log('MES GLOBAL', currentMonthReport.reports)

        currentMonthReport.reports
          .fetch()
          .then((elemen) => console.log(elemen.length))

        SetCurrentYear({
          id: currentYearReport.id,
          year: currentYearReport.year,
        })
        SetCurrentMonth({
          id: currentMonthReport.id,
          name: currentMonthReport.name,
        })
      },
    )
  }, [])

  const value = { currentYear, currentMonth }
  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  )
}

export const useCurrentMonthAndYear = () => {
  const { currentMonth, currentYear } = useContext(ReportContext)
  return {
    currentMonth,
    currentYear,
  }
}
