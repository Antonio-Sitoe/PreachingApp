import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Report } from '@/database/model/Report'

import { calculeTotalNumbers } from '@/utils/calculeTotalNumbers'
import { minutesToHoursAndMinutes, monthNameToPortuguese } from '@/utils/dates'
import { Q } from '@nozbe/watermelondb'
import dayjs from 'dayjs'

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

const GET_ALL_REPORT_DATA = async () => {
  const recordCollection = database.collections.get<Report>('reports')

  const reportsFiltered = await recordCollection
    .query(Q.sortBy('year', Q.desc), Q.sortBy('month', Q.desc))
    .fetch()

  const reportFormated = reportsFiltered.reduce(
    (acumulate, reports) => {
      console.log(reports.year)
      return acumulate
    },
    {
      year: '',
      name: '',
      total: {},
      reports: [],
    },
  )
  console.log(reportsFiltered)

  // const newReports = reportsFiltered.map((report, _, arr) => {
  //   const { data } = calculeTotalNumbers(report)
  //   const totals = `${data.time} Horas, ${data.publications} Publicações, ${data.videos} Videos mostrados, ${data.returnVisits} revisitas, ${data.students} estudantes`

  //   return {
  //     year: String(report.year),
  //     name: monthNameToPortuguese(report.month),
  //     totalText: totals,
  //     reports: arr.map((report) => {
  //       const [month, day, year] = String(report.date).split('/')

  //       const date = dayjs(
  //         new Date(Number(year), Number(month) - 1, Number(day)),
  //       )
  //         .locale('pt-br')
  //         .format('dddd, D [de] MMMM [de] YYYY')
  //       const text = `${
  //         report.hours > 10 ? report.hours : '0' + report.hours
  //       }:${
  //         report.minutes > 10 ? report.minutes : '0' + report.minutes
  //       } Horas, ${report.publications} Publicações, ${
  //         report.videos
  //       } Videos mostrados, ${report.returnVisits} revisitas, ${
  //         report.students
  //       } estudantes`
  //       return {
  //         id: report.id,
  //         date,
  //         text,
  //       }
  //     }),
  //   }
  // })
  // return newReports
  return []
}

export {
  GET_ALL_REPORT_DATA,
  GET_ALL_REPORTS_TO_GLOBAL_STATES,
  getAllReportData,
}
