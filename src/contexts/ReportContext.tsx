import { ReportData } from '@/@types/interfaces'
import { Month } from '@/database/model/report/Month'
import { Year } from '@/database/model/report/Years'
import React, { useContext, useEffect, useState } from 'react'
import { createYearsAndMonthForCurrentDate } from '@/database/actions/report/create'
import { minutesToHoursAndMinutes } from '@/utils/dates'
import dayjs from 'dayjs'
import { database } from '@/database/database'
import { getReportsByMonthIdTranformeToGlobalState } from '@/database/actions/report/read'

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
  updateCurrentReports(monthId: string): Promise<void>
  setReportTabBarIndex(index: number): void
  reportTabBarIndex: number
  isOpenCreateReportModal: boolean
  setisOpenCreateReportModal(index: boolean): void
}
export const ReportContext = React.createContext({} as ReportContextPros)

interface ReportStorageProps {
  children: React.ReactNode
}

export function ReportStorage({ children }: ReportStorageProps) {
  const [year, setYear] = useState<IYear>(initialYear)
  const [month, setMonth] = useState<IMonth>(initialMonth)
  const [reports, setReports] = useState<ReportData>(initialReportData)
  const [reportTabBarIndex, setReportTabBarIndex] = useState(0)
  const [isOpenCreateReportModal, setisOpenCreateReportModal] = useState(false)

  async function updateCurrentReports(monthId: string) {
    const { data } = await getReportsByMonthIdTranformeToGlobalState(monthId)
    setReports({ ...data })
  }

  function setupInitialData() {
    return database.write(async () => {
      const currentYear = dayjs().year().toString()
      const currentMonth = dayjs().locale('en').format('MMMM')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const {
        month,
        year,
      }: {
        year: Year
        month: Month
      } = await createYearsAndMonthForCurrentDate(currentYear, currentMonth)
      setYear({
        id: year.id,
        year: year.year,
      })
      setMonth({
        id: month.id,
        name: month.name,
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const reports = await month.reports.fetch()

      if (reports.length) {
        const data: ReportData = reports.reduce(
          (acc: any, state: any) => {
            const oldState = state._raw
            acc.hours += oldState.hours
            acc.minutes += oldState.minutes
            acc.videos += oldState.videos
            acc.students += oldState.students
            acc.returnVisits += oldState.returnVisits
            acc.publications += oldState.publications
            return acc
          },
          {
            hours: 0,
            minutes: 0,
            publications: 0,
            returnVisits: 0,
            students: 0,
            videos: 0,
            time: '',
          },
        )
        data.time = minutesToHoursAndMinutes(data.hours, data.minutes)
        setReports({ ...data })
      }
      console.log('ANO GLOBAL', 'ano_atual:', year.year, 'id:', year.id)
      console.log('MES GLOBAL', 'mes_atual:', month.name, 'id:', month.id)
    })
  }

  useEffect(() => {
    setupInitialData()
  }, [])
  const value = {
    month,
    year,
    reports,
    updateCurrentReports,
    setReportTabBarIndex,
    reportTabBarIndex,
    isOpenCreateReportModal,
    setisOpenCreateReportModal,
  }
  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  )
}

export const useReportsData = () => {
  const data = useContext(ReportContext)
  return data
}
export const useTabBarIndex = () => {
  const { reportTabBarIndex, setReportTabBarIndex } = useContext(ReportContext)
  return { index: reportTabBarIndex, setIndex: setReportTabBarIndex }
}
