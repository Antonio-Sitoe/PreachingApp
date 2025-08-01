import type { ReportData } from '@/@types/interfaces';
import dayjs from 'dayjs';

export const initialReportData: ReportData = {
  comments: '',
  date: new Date(),
  hours: 0,
  minutes: 0,
  students: 0,
  time: '0:00',
  day: dayjs().get('date'),
  month: '',
  year: dayjs().get('y'),
  createdAt: '',
};
