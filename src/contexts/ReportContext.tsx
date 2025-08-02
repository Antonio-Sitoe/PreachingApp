import { create } from 'zustand';
import { initialReportData } from '@/utils/initialReportData';
import type { IReport } from '@/database/actions';
import { capitalizeString } from '@/utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IShare {
  user: string;
  day: { month: string; year: number };
  data: IReport;
}

interface ReportStore {
  reports: IReport;
  setReportTabBarIndex: (index: number) => void;
  reportTabBarIndex: number;
  isOpenCreateReportModal: boolean;
  setisOpenCreateReportModal: (index: boolean) => void;
  reportToShare: string;
  setTextToShare: (data: IShare) => void;
  isLayoutList: boolean;
  handleChangeLayaltList: () => void;
  set: (data: Partial<ReportStore>) => void;
  reset: () => void;
}

export const useReportsData = create<ReportStore>((set, get) => ({
  reports: initialReportData,
  reportTabBarIndex: 1,
  isOpenCreateReportModal: false,
  reportToShare: '',
  isLayoutList: false,

  setReportTabBarIndex(index) {
    set({ reportTabBarIndex: index });
  },
  setisOpenCreateReportModal(index) {
    set({ isOpenCreateReportModal: index });
  },
  setTextToShare({ user, day, data }) {
    const name = `Relatório de ${user}`;
    const monthText = `${capitalizeString(day.month)} de ${day.year}`;
    const time = `Total de Horas: ${data?.hours}`;
    const students = `Estudos: ${data?.students}`;
    const text = `${name}\n${monthText}\n${time}\n${students}`;
    set({ reportToShare: text });
  },
  handleChangeLayaltList() {
    const current = get().isLayoutList;
    set({ isLayoutList: !current });
    AsyncStorage.setItem('@LayoutList', String(!current));
  },
  set(data) {
    set((state) => ({ ...state, ...data }));
  },
  reset() {
    set((state) => ({
      ...state,
      reports: initialReportData,
      reportTabBarIndex: state.reportTabBarIndex,
      isOpenCreateReportModal: false,
      reportToShare: '',
    }));
  },
}));

export const useTabBarIndex = () => {
  const reportTabBarIndex = useReportsData((state) => state.reportTabBarIndex);
  const setReportTabBarIndex = useReportsData(
    (state) => state.setReportTabBarIndex
  );
  return { index: reportTabBarIndex, setIndex: setReportTabBarIndex };
};
