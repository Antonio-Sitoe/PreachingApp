export interface ReportData {
  id?: string
  date: Date | string
  createdAt: Date | string
  hours: number
  minutes: number
  publications: number
  videos: number
  comments: string
  students: number
  returnVisits: number
  time?: string | number
  day: number
  month: string
  year: number
}

export interface IUser {
  id: string
  name: string
  email: string
  avatar_image: string
  profile: 'publisher' | 'baptized_publisher' | 'pioneer' | string
}

export interface IStudentsBody {
  id?: string
  about?: string
  address?: string
  age: string
  best_day: string[]
  best_time: string[]
  email: string
  gender: 'man' | 'woman'
  name: string
  telephone: string | number
}

export interface VisiteProps {
  id?: string
  biblical_texts: string
  date_and_hours: string | Date
  notes: string
  publications: string
  result: string
  students_id: string
  videos: string
}
