import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Report } from '@/database/model/report/Report'
import { Year } from '@/database/model/report/Years'
import { minutesToHoursAndMinutes } from '@/utils/dates'
import { Q } from '@nozbe/watermelondb'

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

export { READ_ALL_REPORT_DATA, getReportsByMonthIdTranformeToGlobalState }
