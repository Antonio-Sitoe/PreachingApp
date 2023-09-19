import { Q } from '@nozbe/watermelondb'
import { Report } from '@/database/model/Report'
import { database } from '@/database/database'
import { ReportData } from '@/@types/interfaces'
import { minutesToHoursAndMinutes } from '@/utils/dates'
import { sortByYearMonthDay, sorteByMonths, sorteByYears } from '@/utils/helper'
import groupBy from 'group-by'

async function getAllReportData() {
  const recordCollection = database.collections.get<Report>('reports')
  const reports = await recordCollection.query().fetch()
  console.log('relatorios', reports.length)
  reports.forEach((k) => {
    console.log('raw', k._raw)
  })
}
async function GET_ALL_REPORTS_TO_GLOBAL_STATES(month: string, year: number) {
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
  return { data, reports: reportsFiltered }
}
async function GET_REPORTS_BY_YEARS(year: number) {
  const recordCollection = database.collections.get<Report>('reports')
  const reportsFiltered = await recordCollection
    .query(Q.where('year', year))
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
}
async function GET_THE_TOTAL_NUMBER_OF_RECORDS() {
  const count = await database.collections.get('reports').query().fetchCount()
  return { count }
}
async function GET_ALL_REPORT_DATA() {
  const recordCollection = database.collections.get<Report>('reports')

  const reportsFiltered = await recordCollection.query().fetch()

  const transform_report_to_years = Object.entries(
    groupBy(reportsFiltered, 'year'),
  )
  const data_sorted = sorteByYears(transform_report_to_years)
  const final_report_data = data_sorted.map((reportArray) => {
    const arrayOfReports = reportArray[1] as Report[]
    const reports = groupBy(arrayOfReports, 'month')
    return {
      year: reportArray[0],
      reports: sorteByMonths(Object.entries(reports)),
    }
  })

  return { data: final_report_data }
}
async function GET_PARTIAL_REPORTDATA() {
  const recordCollection = database.collections.get<Report>('reports')

  const reports = await recordCollection
    .query(Q.sortBy('createdAt', Q.desc))
    .fetch()
  const final_report_data = sortByYearMonthDay(reports)
  return { data: final_report_data }
}
async function GET_REPORT_BY_ID(id: string) {
  const recordCollection = database.collections.get<Report>('reports')
  const reportsFiltered = await recordCollection
    .query(Q.where('id', id))
    .fetch()
  return reportsFiltered[0]
}

export {
  GET_ALL_REPORT_DATA,
  GET_ALL_REPORTS_TO_GLOBAL_STATES,
  GET_THE_TOTAL_NUMBER_OF_RECORDS,
  GET_REPORTS_BY_YEARS,
  GET_REPORT_BY_ID,
  GET_PARTIAL_REPORTDATA,
  getAllReportData,
}
