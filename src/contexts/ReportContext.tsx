import { create } from 'zustand';
import { initialReportData } from '@/utils/initialReportData';
import { type IReport, reportsActions } from '@/database/actions';
import { capitalizeString } from '@/utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IShare {
  user: string;
  day: { month: string; year: number };
  data: IReport;
}

interface ReportStore {
  reports: IReport;
  updateCurrentReports: (month: string, year: number) => Promise<void>;
  setReportTabBarIndex: (index: number) => void;
  reportTabBarIndex: number;
  isOpenCreateReportModal: boolean;
  setisOpenCreateReportModal: (index: boolean) => void;
  reportToShare: string;
  setTextToShare: (data: IShare) => void;
  isLayoutList: boolean;
  handleChangeLayaltList: () => void;
}

export const useReportsData = create<ReportStore>((set, get) => ({
  reports: initialReportData,
  reportTabBarIndex: 1,
  isOpenCreateReportModal: false,
  reportToShare: '',
  isLayoutList: false,
  async updateCurrentReports(month, year) {
    const { data } = await reportsActions.getGlobalStates({ month, year });
    set({ reports: { ...data } });
  },
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
}));

export const useTabBarIndex = () => {
  const reportTabBarIndex = useReportsData((state) => state.reportTabBarIndex);
  const setReportTabBarIndex = useReportsData(
    (state) => state.setReportTabBarIndex
  );
  return { index: reportTabBarIndex, setIndex: setReportTabBarIndex };
};
