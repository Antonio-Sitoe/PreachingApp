import React, { useCallback, useContext, useEffect, useState } from 'react';
import { currentDates } from '@/utils/dates';
import { initialReportData } from '@/utils/initialReportData';
import { type IReport, reportsActions } from '@/database/actions';
import { capitalizeString } from '@/utils/helper';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

interface IShare {
  user: string;
  day: { month: string; year: number };
  data: IReport;
}

interface ReportContextPros {
  reports: IReport;
  updateCurrentReports(monthId: string, year: number): Promise<void>;
  setReportTabBarIndex(index: number): void;
  reportTabBarIndex: number;
  isOpenCreateReportModal: boolean;
  setisOpenCreateReportModal(index: boolean): void;
  reportToShare: string;
  setTextToShare(data: IShare): void;
  isLayoutList: boolean;
  handleChangeLayaltList(): void;
}
export const ReportContext = React.createContext({} as ReportContextPros);

interface ReportStorageProps {
  children: React.ReactNode;
}

export function ReportStorage({ children }: ReportStorageProps) {
  const [reports, setReports] = useState<IReport>(initialReportData);
  const { setItem, getItem } = useAsyncStorage('@LayoutList');
  const [reportToShare, setreportToShare] = useState('');
  const [reportTabBarIndex, setReportTabBarIndex] = useState(0);
  const [isOpenCreateReportModal, setisOpenCreateReportModal] = useState(false);
  const [isLayoutList, setIsLayoutList] = useState(false);

  async function updateCurrentReports(month: string, year: number) {
    const { data } = await reportsActions.getGlobalStates({ month, year });
    setReports({ ...data });
  }
  const setTextToShare = useCallback(({ user, day, data }) => {
    const name = 'Relatório de ' + user;
    const monthText = capitalizeString(day.month) + ' de ' + day.year;
    const time = 'Total de Horas: ' + data?.hours;
    const pub = 'Publicacoes: ' + data?.publications;
    const videos = 'Videos Mostrados: ' + data?.videos;
    const returns = 'Revisitas: ' + data?.returnVisits;
    const Estudos = 'Estudos: ' + data?.students;
    const text = `${name}\n${monthText}\n${time}\n${pub}\n${videos}\n${returns}\n${Estudos}`;
    setreportToShare(text);
  }, []);
  function handleChangeLayaltList() {
    setIsLayoutList(!isLayoutList);
    setItem(String(!isLayoutList));
  }

  useEffect(() => {
    updateCurrentReports(currentDates.month, currentDates.year);
  }, []);

  useEffect(() => {
    async function getLayoutList() {
      const islay = await getItem();
      setIsLayoutList(islay !== 'false');
    }
    getLayoutList();
  }, [getItem]);

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
  };
  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}

export const useReportsData = () => {
  const data = useContext(ReportContext);
  return data;
};
export const useTabBarIndex = () => {
  const { reportTabBarIndex, setReportTabBarIndex } = useContext(ReportContext);
  return { index: reportTabBarIndex, setIndex: setReportTabBarIndex };
};
