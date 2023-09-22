import { createReportData } from '@/database/actions/report/create'

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate() {
  if (!getRandomDate.currentDate) {
    getRandomDate.currentDate = new Date('2023-08-25')
  } else {
    getRandomDate.currentDate.setDate(getRandomDate.currentDate.getDate() + 1)
  }
  return getRandomDate.currentDate
}

getRandomDate.reset = () => {
  // getRandomDate.currentDate = new Date('2025-09-01') // atualiza aqui
  getRandomDate.currentDate = new Date() // atualiza aqui
}

getRandomDate.reset()
const dataArray = []

for (let i = 0; i < 70; i++) {
  const randomDate = getRandomDate()
  const day = randomDate.getDate()
  const month = randomDate.getMonth() + 1
  const year = randomDate.getFullYear()

  const formattedDay = day < 10 ? `0${day}` : day
  const formattedMonth = month < 10 ? `0${month}` : month

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

let i = 0
async function generateReports() {
  for await (const data of dataArray) {
    console.log('Criando...', data)
    await createReportData(data)
    console.log('...Sucess', i)
    i++
  }
}

export { generateReports }
