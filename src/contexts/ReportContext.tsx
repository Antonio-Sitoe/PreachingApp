import { ReportData } from '@/@types/interfaces'
import React, { useContext, useState } from 'react'
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

interface ReportContextPros {
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
  const [reports, setReports] = useState<ReportData>(initialReportData)
  const [reportTabBarIndex, setReportTabBarIndex] = useState(0)
  const [isOpenCreateReportModal, setisOpenCreateReportModal] = useState(false)

  async function updateCurrentReports(monthId: string) {
    const { data } = await getReportsByMonthIdTranformeToGlobalState(monthId)
    setReports({ ...data })
  }

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
