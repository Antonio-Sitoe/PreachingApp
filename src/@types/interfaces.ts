export interface ReportData {
  comments: string;
  date: Date | string;
  hours: number;
  minutes: number;
  publications: number;
  returnVisits: number;
  students: number;
  videos: number;
  time: string;
  day: number | string;
  month: string;
  year: number | string;
  createdAt: string;
  id?: string;
  updatedAt?: string;
}

export interface ReportDataProps {
  reports: Array<[string, ReportData[]]>;
}

export interface CardProps extends ReportDataProps {
  // Add any additional card-specific properties here
}
