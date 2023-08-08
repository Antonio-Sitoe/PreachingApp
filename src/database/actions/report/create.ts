/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Report } from '@/database/model/Report'
import { Q } from '@nozbe/watermelondb'
import dayjs from 'dayjs'

async function createReportData(newRecordData: ReportData) {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')

    const date = dayjs(newRecordData.date).format('MM/DD/YYYY')

    // Verifique se já existe um registro para a data especificada no mês
    const existingRecord = await recordCollection.query(Q.where('date', date))

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
      record.date_event = `${newRecordData.date}`
      record.createdAt = `${new Date()}`
    })
    return newRecord
  })
}

export { createReportData }
