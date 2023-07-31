import { database } from '@/database/database'
import { Year } from '@/database/model/report/Years'
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

  function createYearsAndMonthForCurrentDate() {
    const currentDate = new Date()
    const currentYear = String(currentDate.getFullYear())
    const currentMonth = currentDate.toLocaleString('en-US', {
      month: 'long',
    })

    return database.write(async () => {
      const yearColletion = database.collections.get('years')
      const monthColletion = database.collections.get<Year>('months')

      let currentYearReport = (await yearColletion.query(
        Q.where('year', currentYear),
      )) as any
      if (currentYearReport.length === 0) {
        currentYearReport = (await yearColletion.create((year: any) => {
          year.year = currentYear
        })) as any
      } else {
        currentYearReport = currentYearReport[0] as any
      }

      let currentMonthReport = await monthColletion.query(
        Q.and(
          Q.where('year_id', currentYearReport?.id),
          Q.where('name', currentMonth),
        ),
      )

      if (currentMonthReport.length === 0) {
        currentMonthReport = (await monthColletion.create((month: any) => {
          month.name = currentMonth
          month.year.id = currentYearReport.id
        })) as any
      } else {
        currentMonthReport = currentMonthReport[0] as any
      }
      return {
        currentYearReport,
        currentMonthReport,
      }
    })
  }
  useEffect(() => {
    createYearsAndMonthForCurrentDate().then(
      ({ currentYearReport, currentMonthReport }: any) => {
        console.log('ANO GLOBAL', currentYearReport)
        console.log('MES GLOBAL', currentMonthReport)
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
