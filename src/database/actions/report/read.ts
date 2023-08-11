import { Q } from '@nozbe/watermelondb'
import { Report } from '@/database/model/Report'
import { database } from '@/database/database'
import { ReportData } from '@/@types/interfaces'
import { minutesToHoursAndMinutes } from '@/utils/dates'
import { sorteByMonths, sorteByYears } from '@/utils/helper'

async function getAllReportData() {
  const recordCollection = database.collections.get<Report>('reports')

  const reports = await recordCollection.query().fetch()
  console.log('relatorios', reports.length)

  reports.forEach((k) => {
    console.log('raw', k._raw)
  })
}

function GET_ALL_REPORTS_TO_GLOBAL_STATES(month: number, year: number) {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')
    const reportsFiltered = await recordCollection
      .query(Q.and(Q.where('month', month), Q.where('year', year)))
      .fetch()

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
  })
}
const GET_THE_TOTAL_NUMBER_OF_RECORDS = async () => {
  const count = await database.collections.get('reports').query().fetchCount()

  return { count }
}

const GET_ALL_REPORT_DATA = async (take?: number) => {
  const recordCollection = database.collections.get<Report>('reports')
  const { count } = await GET_THE_TOTAL_NUMBER_OF_RECORDS()

  let reportsFiltered: any = null
  if (take) {
    reportsFiltered = await recordCollection
      .query(
        Q.sortBy('year', Q.desc),
        Q.sortBy('month', Q.desc),
        Q.take(take),
        Q.skip(0),
      )
      .fetch()
  } else {
    reportsFiltered = await recordCollection
      .query(Q.sortBy('year', Q.desc), Q.sortBy('month', Q.desc))
      .fetch()
  }

  const transform_report_to_years = reportsFiltered.reduce(
    (acumulate, reports: Report) => {
      acumulate[reports.year] = acumulate[reports.year] || []
      acumulate[reports.year].push(reports)
      return acumulate
    },
    {},
  )

  const transform_report_to_month = Object.entries(transform_report_to_years)
  const data_sorted = sorteByYears(transform_report_to_month)

  const final_report_data = data_sorted.map((reportArray) => {
    const arrayOfReports = reportArray[1] as Report[]
    const reports = arrayOfReports.reduce((acumulate, reports) => {
      acumulate[reports.month] = acumulate[reports.month] || []
      acumulate[reports.month].push(reports)
      return acumulate
    }, {})

    return {
      year: reportArray[0],
      reports: sorteByMonths(Object.entries(reports)),
    }
  })

  return { data: final_report_data, count }
}

export {
  GET_ALL_REPORT_DATA,
  GET_ALL_REPORTS_TO_GLOBAL_STATES,
  GET_THE_TOTAL_NUMBER_OF_RECORDS,
  getAllReportData,
}
