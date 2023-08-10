import React, { useContext, useEffect, useState } from 'react'
import { ReportData } from '@/@types/interfaces'
import { currentDates } from '@/utils/dates'
import { initialReportData } from '@/utils/initialReportData'
import { GET_ALL_REPORTS_TO_GLOBAL_STATES } from '@/database/actions/report/read'

interface ReportContextPros {
  reports: ReportData
  updateCurrentReports(monthId: number, year: number): Promise<void>
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
  const [reports, setReports] = useState<ReportData>(initialReportData)
  const [reportTabBarIndex, setReportTabBarIndex] = useState(0)
  const [isOpenCreateReportModal, setisOpenCreateReportModal] = useState(false)

  async function updateCurrentReports(month: number, year: number) {
    const { data } = await GET_ALL_REPORTS_TO_GLOBAL_STATES(month, year)
    setReports({ ...data })
  }

  useEffect(() => {
    updateCurrentReports(currentDates.month, currentDates.year)
  }, [])

  const value = {
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
