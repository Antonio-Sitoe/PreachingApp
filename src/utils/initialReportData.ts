import dayjs from 'dayjs';
import type { IReport } from '@/database/actions';

export const initialReportData: IReport = {
  id: '',
  comments: '',
  date: '',
  hours: 0,
  minutes: 0,
  updatedAt: '',
  students: 0,
  time: '0:00',
  day: dayjs().get('date'),
  month: dayjs().get('month') + 1,
  year: dayjs().get('y'),
  createdAt: '',
};
