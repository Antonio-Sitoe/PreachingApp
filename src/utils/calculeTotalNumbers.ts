import type { IReport } from '@/database/schemas';
import { minutesToHoursAndMinutes } from './dates';
export interface IReportData extends IReport {
  time: string;
}

export function calculeTotalNumbers(reportsFiltered) {
  const data: IReportData = reportsFiltered.reduce(
    (acc: any, state: any) => {
      const oldState = state._raw || state;
      acc.hours += oldState.hours || 0;
      acc.minutes += oldState.minutes || 0;
      acc.students += oldState.students || 0;
      return acc;
    },
    {
      hours: 0,
      minutes: 0,
      students: 0,
      time: '',
    }
  );
  data.time = minutesToHoursAndMinutes(data.hours, data.minutes);
  return { data };
}
