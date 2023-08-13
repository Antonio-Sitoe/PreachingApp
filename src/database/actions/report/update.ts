import { ReportData } from '@/@types/interfaces'
import { database } from '@/database/database'
import { Report } from '@/database/model/Report'
import { Q } from '@nozbe/watermelondb'

const UPDATE_REPORT_BY_ID = (id: string, newRecordData: ReportData) => {
  return database.write(async () => {
    const recordCollection = database.collections.get<Report>('reports')

    // Verifique se já existe um registro para a data especificada no mês
    const existingRecord = await recordCollection
      .query(Q.where('id', id))
      .fetch()

    if (existingRecord.length > 0) {
      // Se já existe um registro, faça a atualização nos dados do registro existente
      const existingRecordId = existingRecord[0].id
      const recordColletionById = await recordCollection.find(existingRecordId)

      recordColletionById.update((record): void => {
        record.hours = newRecordData.hours
        record.minutes = newRecordData.minutes
        record.publications = newRecordData.publications
        record.videos = newRecordData.videos
        record.returnVisits = newRecordData.returnVisits
        record.students = newRecordData.students
        record.date = newRecordData.date
        record.day = newRecordData.day
        record.month = newRecordData.month
        record.year = newRecordData.year
        record.createdAt = `${newRecordData.createdAt}`
        if (newRecordData.comments) record.comments = newRecordData.comments
      })

      console.log(recordCollection.find(existingRecordId))
      return recordCollection.find(existingRecordId)
    }

    return null
  })
}

export { UPDATE_REPORT_BY_ID }
