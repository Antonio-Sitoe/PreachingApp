import { createReportData } from '@/database/actions/report/create'
import dayjs from 'dayjs'
import { monthNameToPortuguese } from './dates'

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(year, month) {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  const randomDay = getRandomNumber(1, endDate.getDate())
  const randomDate = new Date(year, month, randomDay)

  return randomDate
}

const dataArray = []

for (let year = 2023; year <= 2023; year++) {
  for (let month = 0; month < 12; month++) {
    for (let i = 0; i < 3; i++) {
      const randomDate = getRandomDate(year, month)
      const day = randomDate.getDate()
      const formattedDay = day < 10 ? `0${day}` : day
      const formattedMonth = monthNameToPortuguese(month + 1)

      const dataObject = {
        comments: '',
        createdAt: randomDate.toISOString(),
        date: `${formattedDay}/${formattedMonth}/${year}`,
        day,
        hours: getRandomNumber(0, 23),
        minutes: getRandomNumber(0, 59),
        month: formattedMonth,
        publications: getRandomNumber(0, 10),
        returnVisits: getRandomNumber(0, 5),
        students: getRandomNumber(0, 10),
        videos: getRandomNumber(0, 5),
        year,
      }

      dataArray.push(dataObject)
    }
  }
}

let i = 0
async function generateReports() {
  for await (const data of dataArray) {
    console.log('Criando...', data)
    await createReportData(data)
    console.log('...Sucesso', i)
    i++
  }
}

export { generateReports }
