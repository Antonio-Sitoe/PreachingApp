import { createReportData } from '@/database/actions/report/create'
import dayjs from 'dayjs'
import { monthNameToPortuguese } from './dates'
import { CREATE_STUDENTS } from '@/database/actions/students/create'

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

// Função para gerar dados similares
function generateRandomData() {
  // Arrays de opções para diferentes propriedades
  const genders = ['man', 'woman']
  const names = [
    'Emma Smith',
    'Charlie Jones',
    'Jack Moore',
    'David Wilson',
    'Charlie Miller',
    'Grace Jones',
    'David Miller',
    'Charlie Williams',
    'Emma Smith',
    'Frank Smith',
    'Emma Johnson',
    'Jack Moore',
    'Grace Miller',
    'Bob Williams',
    'Bob Williams',
    'Charlie Moore',
    'Frank Brown',
    'Henry Wilson',
    'Bob Brown',
    'Emma Johnson',
    'Frank Jones',
    'David Taylor',
    'Grace Miller',
    'Emma Johnson',
    'Alice Jones',
    'Ivy Moore',
    'Alice Taylor',
    'Charlie Johnson',
    'Alice Miller',
    'Charlie Taylor',
  ]
  const ages = ['15-20', '21-25', '26-30', '31-35']
  const bestDays = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ]
  const bestTimes = ['Manhã', 'Tarde', 'Noite']

  // Função para escolher aleatoriamente um elemento de um array
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Objeto de dados simulados
  const randomData = {
    about:
      'Ela é alta, clara e forte, gosta de fazer muitas perguntas e não tem problemas em sorrir.',
    address: 'Machava sede, Moçambique',
    age: getRandomElement(ages),
    best_day: [getRandomElement(bestDays)],
    best_time: [getRandomElement(bestTimes)],
    email: 'example@example.com',
    gender: getRandomElement(genders),
    name: getRandomElement(names),
    telephone: Math.floor(Math.random() * 1000000000).toString(),
  }

  return randomData
}

async function generateMassData(quantity) {
  const massData = []
  for (let i = 0; i < quantity; i++) {
    massData.push(generateRandomData())
  }

  for await (const data of massData) {
    console.log('Criando...', data)
    await CREATE_STUDENTS(data)
    console.log('...Sucesso')
  }
  return massData
}

export { generateReports, generateMassData }
