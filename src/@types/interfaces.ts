export interface ReportData {
  id?: string
  date: Date | string
  hours: number
  minutes: number
  publications: number
  videos: number
  comments: string
  students: number
  returnVisits: number
  time?: string | number
  month?: {
    id: string
  }
}