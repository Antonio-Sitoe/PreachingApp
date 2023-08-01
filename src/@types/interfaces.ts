export interface ReportData {
  date: Date | string
  hours: number
  minutes: number
  publications: number
  videos: number
  comments: string
  students: number
  returnVisits: number
  month?: {
    id: string
  }
}
