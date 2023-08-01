import { ReportData } from '@/@types/interfaces'
import { Month } from '@/database/model/report/Month'
import { Year } from '@/database/model/report/Years'
import React, { useContext, useEffect, useState } from 'react'
import { createYearsAndMonthForCurrentDate } from '@/database/actions/report/create'
import { minutesToHoursAndMinutes } from '@/utils/dates'

const initialReportData: ReportData = {
  comments: '',
  date: new Date(),
  hours: 0,
  minutes: 0,
  publications: 0,
  returnVisits: 0,
  students: 0,
  videos: 0,
  time: '',
}

const initialYear = { id: '', year: '' }
const initialMonth = { id: '', name: '' }

type IYear = { id: string; year: string }
type IMonth = { id: string; name: string }

interface ReportContextPros {
  month: IMonth
  year: IYear
  reports: ReportData
  calculateReportData(reports: ReportData[]): void
}
export const ReportContext = React.createContext({} as ReportContextPros)

interface ReportStorageProps {
  children: React.ReactNode
}

export function ReportStorage({ children }: ReportStorageProps) {
  const [year, setYear] = useState<IYear>(initialYear)
  const [month, setMonth] = useState<IMonth>(initialMonth)
  const [reports, setReports] = useState<ReportData>(initialReportData)

  function calculateReportData(reports: ReportData[]) {
    const data = reports.reduce((acc: any, state: any) => {
      const oldState = state._raw
      acc.hours += oldState.hours
      acc.minutes += oldState.minutes
      acc.videos += oldState.videos
      acc.students += oldState.students
      acc.returnVisits += oldState.returnVisits
      acc.publications += oldState.publications
      return acc
    }, initialReportData)
    data.time = minutesToHoursAndMinutes(data.hours, data.minutes)
    setReports({ ...data })
  }

  async function setupInitialValues() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {
      currentYearReport,
      currentMonthReport,
    }: {
      currentYearReport: Year
      currentMonthReport: Month
    } = await createYearsAndMonthForCurrentDate()

    setYear({
      id: currentYearReport.id,
      year: currentYearReport.year,
    })
    setMonth({
      id: currentMonthReport.id,
      name: currentMonthReport.name,
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const reports = await currentMonthReport.reports.fetch()

    if (reports.length) {
      const data: ReportData = reports.reduce((acc: any, state: any) => {
        const oldState = state._raw
        acc.hours += oldState.hours
        acc.minutes += oldState.minutes
        acc.videos += oldState.videos
        acc.students += oldState.students
        acc.returnVisits += oldState.returnVisits
        acc.publications += oldState.publications
        return acc
      }, initialReportData)
      data.time = minutesToHoursAndMinutes(data.hours, data.minutes)
      setReports({ ...data })
    }
    console.log('ANO GLOBAL', currentYearReport)
    console.log('MES GLOBAL', currentMonthReport.reports)
  }

  useEffect(() => {
    setupInitialValues()
  }, [])
  const value = { month, year, reports, calculateReportData }
  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  )
}

export const useReportsData = () => {
  const { month, year, reports } = useContext(ReportContext)
  return { month, year, reports }
}
