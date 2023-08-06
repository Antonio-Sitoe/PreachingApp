import { ReportData } from '@/@types/interfaces'
import report from '@/app/(tabs)/report'
import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Report } from '@/database/model/report/Report'
import { Year } from '@/database/model/report/Years'
import { calculeTotalNumbers } from '@/utils/calculeTotalNumbers'
import { minutesToHoursAndMinutes, monthNameToPortuguese } from '@/utils/dates'
import { Q } from '@nozbe/watermelondb'
import dayjs from 'dayjs'

async function getAllReportData() {
  const yearColletion = database.collections.get<Year>('years')
  const monthCollection = database.collections.get<Month>('months')
  const recordCollection = database.collections.get<Report>('reports')

  const y = await yearColletion.query().fetch()
  console.log('anos', y.length)
  const m = await monthCollection.query().fetch()
  console.log('MESES', m)
  m.forEach((k) => {
    console.log(k.id, ' raw', k._raw.id)
  })
  const r = await recordCollection.query().fetch()
  console.log('relatorios', r.length)
}

function getReportsByMonthIdTranformeToGlobalState(monthId: string) {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')
    const reportsFiltered = await recordCollection
      .query(Q.where('month_id', monthId))
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

const READ_ALL_REPORT_DATA = async () => {
  const monthCollection = database.collections.get<Month>('months')
  const monthsArray = await monthCollection
    .query(Q.sortBy('createdAt', Q.desc))
    .fetch()

  const newReportData = await Promise.all(
    monthsArray.map((months) => {
      return getByMonth(months)
    }),
  )
  async function getByMonth(months: Month) {
    const reports = await months.reports
    const year = await months.year

    const newReports = reports.map((report) => {
      const [month, day, year] = String(report.date).split('/')
      const date = dayjs(new Date(Number(year), Number(month) - 1, Number(day)))
        .locale('pt-br')
        .format('dddd, D [de] MMMM [de] YYYY')
      const text = `${report.hours > 10 ? report.hours : '0' + report.hours}:${
        report.minutes > 10 ? report.minutes : '0' + report.minutes
      } Horas, ${report.publications} Publicações, ${
        report.videos
      } Videos mostrados, ${report.returnVisits} revisitas, ${
        report.students
      } estudantes`
      return {
        id: report.id,
        date,
        text,
      }
    })
    const { data } = calculeTotalNumbers(reports)
    const totals = `${data.time} Horas, ${data.publications} Publicações, ${data.videos} Videos mostrados, ${data.returnVisits} revisitas, ${data.students} estudantes`
    return {
      id: months.id,
      year: String(year.year),
      name: monthNameToPortuguese(months.name),
      totalText: totals,
      reports: newReports,
    }
  }

  return newReportData
}

export {
  READ_ALL_REPORT_DATA,
  getReportsByMonthIdTranformeToGlobalState,
  getAllReportData,
}
