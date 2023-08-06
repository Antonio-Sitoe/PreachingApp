import { ReportData } from '@/@types/interfaces'
import { minutesToHoursAndMinutes } from './dates'

export function calculeTotalNumbers(reportsFiltered) {
  const data: ReportData = reportsFiltered.reduce(
    (acc: any, state: any) => {
      const oldState = state._raw
      acc.hours += oldState.hours
      acc.minutes += oldState.minutes
      acc.videos += oldState.videos
      acc.students += oldState.students
      acc.returnVisits += oldState.returnVisits
      acc.publications += oldState.publications
      return acc
    },
    {
      hours: 0,
      minutes: 0,
      publications: 0,
      returnVisits: 0,
      students: 0,
      videos: 0,
      time: '',
    },
  )
  data.time = minutesToHoursAndMinutes(data.hours, data.minutes)
  return { data }
}
