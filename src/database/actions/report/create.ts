/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Month } from '@/database/model/report/Month'
import { Report } from '@/database/model/report/Report'
import { Year } from '@/database/model/report/Years'
import { Q } from '@nozbe/watermelondb'
import dayjs from 'dayjs'

async function createReportData(newRecordData: ReportData) {
  return database.write(async () => {
    const monthCollection = database.collections.get<Month>('months')
    const recordCollection = database.collections.get<Report>('reports')

    const date = dayjs(newRecordData.date).format('MM/DD/YYYY')
    const currentYear = dayjs(newRecordData.date).year().toString()
    const currentMonth = dayjs(newRecordData.date).locale('en').format('MMMM')

    const { month } = await createYearsAndMonthForCurrentDate(
      currentYear,
      currentMonth,
    )
    // @ts-ignore
    const monthId = month.id

    // Verifique se já existe um registro para a data especificada no mês
    const existingRecord = await recordCollection.query(
      Q.and(Q.where('month_id', monthId), Q.where('date', date)),
    )

    if (existingRecord.length > 0) {
      // Se já existe um registro, faça a atualização nos dados do registro existente
      const existingRecordId = existingRecord[0].id

      const recordColletionById = await recordCollection.find(existingRecordId)

      recordColletionById.update((record): void => {
        record.hours += newRecordData.hours
        record.minutes += newRecordData.minutes
        record.publications += newRecordData.publications
        record.videos += newRecordData.videos
        record.returnVisits += newRecordData.returnVisits
        record.students += newRecordData.students
        if (newRecordData.comments) record.comments = newRecordData.comments
      })

      return recordCollection.find(existingRecordId)
    }

    // Se não existir um registro para a data, crie um novo registro
    const newRecord = await recordCollection.create((record: any) => {
      record.date = date
      record.minutes = newRecordData.minutes
      record.hours = newRecordData.hours
      record.publications = newRecordData.publications
      record.videos = newRecordData.videos
      record.returnVisits = newRecordData.returnVisits
      record.students = newRecordData.students
      record.comments = newRecordData.comments
      record.month.id = monthId
    })

    // // Atualize a coleção de meses associada a este registro
    const months = await monthCollection.find(monthId)
    // @ts-ignore
    await months.reports?.fetch()

    return newRecord
  })
}

async function createYearsAndMonthForCurrentDate(
  currentYear: string,
  currentMonth: string,
) {
  const yearColletion = database.collections.get<Year>('years')
  const monthColletion = database.collections.get<Month>('months')

  let currentYearReport = (await yearColletion.query(
    Q.where('year', currentYear),
  )) as any
  if (currentYearReport.length === 0) {
    currentYearReport = (await yearColletion.create((year: any) => {
      year.year = currentYear
    })) as any
  } else {
    currentYearReport = currentYearReport[0] as any
  }

  let currentMonthReport = await monthColletion.query(
    Q.and(
      Q.where('year_id', currentYearReport?.id),
      Q.where('name', currentMonth),
    ),
  )

  if (currentMonthReport.length === 0) {
    currentMonthReport = (await monthColletion.create((month: any) => {
      month.name = currentMonth
      month.year.id = currentYearReport.id
    })) as any
  } else {
    currentMonthReport = currentMonthReport[0] as any
  }

  return {
    year: currentYearReport,
    month: currentMonthReport,
  }
}
export { createReportData, createYearsAndMonthForCurrentDate }
