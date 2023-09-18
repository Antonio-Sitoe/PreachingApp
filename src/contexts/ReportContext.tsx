import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ReportData } from '@/@types/interfaces'
import { currentDates } from '@/utils/dates'
import { initialReportData } from '@/utils/initialReportData'
import { GET_ALL_REPORTS_TO_GLOBAL_STATES } from '@/database/actions/report/read'
import { capitalizeString } from '@/utils/helper'

interface IShare {
  user: string
  day: { month: string; year: number }
  data: ReportData
}

interface ReportContextPros {
  reports: ReportData
  updateCurrentReports(monthId: string, year: number): Promise<void>
  setReportTabBarIndex(index: number): void
  reportTabBarIndex: number
  isOpenCreateReportModal: boolean
  setisOpenCreateReportModal(index: boolean): void
  reportToShare: string
  setTextToShare(data: IShare): void
  isLayoutList: boolean
  handleChangeLayaltList(): void
}
export const ReportContext = React.createContext({} as ReportContextPros)

interface ReportStorageProps {
  children: React.ReactNode
}

export function ReportStorage({ children }: ReportStorageProps) {
  const [reports, setReports] = useState<ReportData>(initialReportData)
  const [reportToShare, setreportToShare] = useState('')
  const [reportTabBarIndex, setReportTabBarIndex] = useState(0)
  const [isOpenCreateReportModal, setisOpenCreateReportModal] = useState(false)
  const [isLayoutList, setIsLayoutList] = useState(false)

  async function updateCurrentReports(month: string, year: number) {
    const { data } = await GET_ALL_REPORTS_TO_GLOBAL_STATES(month, year)
    setReports({ ...data })
  }
  const setTextToShare = useCallback(function ({ user, day, data }) {
    const name = 'Relatório de ' + user
    const monthText = capitalizeString(day.month) + ' de ' + day.year
    const time = 'Total de Horas: ' + data?.hours
    const pub = 'Publicacoes: ' + data?.publications
    const videos = 'Videos Mostrados: ' + data?.videos
    const returns = 'Revisitas: ' + data?.returnVisits
    const Estudos = 'Estudos: ' + data?.students
    const text = `${name}\n${monthText}\n${time}\n${pub}\n${videos}\n${returns}\n${Estudos}`
    setreportToShare(text)
  }, [])
  function handleChangeLayaltList() {
    setIsLayoutList(!isLayoutList)
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
    reportToShare,
    setTextToShare,
    isLayoutList,
    handleChangeLayaltList,
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
