import { reportsActions } from '@/database/actions'
import { monthNameToPortuguese } from './dates'
import { studentsAction } from '@/database/actions'

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(year, month) {
  const endDate = new Date(year, month + 1, 0)
  const randomDay = getRandomNumber(1, endDate.getDate())
  const randomDate = new Date(year, month, randomDay)
  return randomDate
}

// Função para gerar dados fictícios de relatórios
function generateFakeReportData(quantity = 50) {
  const fakeReports = []

  for (let i = 0; i < quantity; i++) {
    // Gerar ano aleatório entre 2023 e 2024
    const year = getRandomNumber(2023, 2024)
    // Gerar mês aleatório (0-11)
    const month = getRandomNumber(0, 11)

    const randomDate = getRandomDate(year, month)
    const day = randomDate.getDate()
    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = monthNameToPortuguese(month + 1)

    // Gerar comentários aleatórios
    const comments = [
      'Pregação muito produtiva hoje',
      'Várias pessoas interessadas',
      'Bom dia de evangelização',
      'Alguns estudantes fizeram perguntas interessantes',
      'Distribuímos várias publicações',
      'Fizemos visitas de retorno',
      'Dia muito abençoado',
      'Novos interessados encontrados',
      'Estudantes muito receptivos',
      'Pregação no centro da cidade'
    ]

    const randomComment = comments[getRandomNumber(0, comments.length - 1)]

    const reportData = {
      date: `${formattedDay}/${formattedMonth}/${year}`,
      year,
      month: formattedMonth,
      day,
      hours: getRandomNumber(1, 8), // 1-8 horas
      minutes: getRandomNumber(0, 59), // 0-59 minutos
      students: getRandomNumber(1, 15), // 1-15 estudantes
      comments: randomComment,
    }

    fakeReports.push(reportData)
  }

  return fakeReports
}

// Função para inserção em massa usando createMany
async function generateReportsBulk(quantity = 50) {
  try {
    console.log(`Gerando ${quantity} relatórios fictícios...`)

    const fakeReports = generateFakeReportData(quantity)

    console.log('Iniciando inserção em massa...')

    for (const report of fakeReports) {
      await reportsActions.create(report)
    }

    console.log('Resultado da inserção em massa:')
    console.log(`Relatórios criados com sucesso: ${fakeReports.length}`)
    console.log(`Relatórios que falharam: ${0}`)

    return fakeReports.length
  } catch (error) {
    console.error('Erro na inserção em massa:', error)
    throw error
  }
}

const dataArray = []

for (let year = 2023; year <= 2023; year++) {
  for (let month = 0; month < 12; month++) {
    for (let i = 0; i < 3; i++) {
      const randomDate = getRandomDate(year, month)
      const day = randomDate.getDate()

      const dataObject = {
        comments: '',
        createdAt: String(dayjs(randomDate)),
        date: String(dayjs(randomDate)),
        day,
        hours: getRandomNumber(0, 23),
        minutes: getRandomNumber(0, 59),
        month: month + 1,
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
    await reportsActions.create(data)
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
    bestDay: JSON.stringify([getRandomElement(bestDays)]),
    bestTime: JSON.stringify([getRandomElement(bestTimes)]),
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
    await studentsAction.create(data)
    console.log('...Sucesso')
  }
  return massData
}

export { generateReports, generateMassData, generateReportsBulk, generateFakeReportData }
