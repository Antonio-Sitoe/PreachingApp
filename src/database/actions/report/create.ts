/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Report } from '@/database/model/Report'
import { Q } from '@nozbe/watermelondb'

async function createReportData(newRecordData: ReportData) {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')

    // Verifique se já existe um registro para a data especificada no mês
    const existingRecord = await recordCollection.query(
      Q.where('date', `${newRecordData.date}`),
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
      record.date = newRecordData.date
      record.hours = newRecordData.hours
      record.minutes = newRecordData.minutes
      record.publications = newRecordData.publications
      record.videos = newRecordData.videos
      record.returnVisits = newRecordData.returnVisits
      record.students = newRecordData.students
      record.comments = newRecordData.comments

      record.createdAt = `${newRecordData.createdAt}`

      record.day = newRecordData.day
      record.month = newRecordData.month
      record.year = newRecordData.year
    })
    return newRecord
  })
}

export { createReportData }
