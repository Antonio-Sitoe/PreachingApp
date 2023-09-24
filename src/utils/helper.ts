import { ReportData } from '@/@types/interfaces'
import { minutesToHoursAndMinutes } from './dates'

export function sorteByYears(arr: any) {
  const objetoOrdenado = [...arr].sort((a, b) => {
    // converte as strings em números para comparar
    const anoA = Number(a[0])
    const anoB = Number(b[0])

    // se anoA for maior que anoB, retorna um número negativo para colocar a antes de b
    if (anoA > anoB) {
      return -1
    }

    // se anoA for menor que anoB, retorna um número positivo para colocar b antes de a
    if (anoA < anoB) {
      return 1
    }

    // se anoA for igual a anoB, retorna zero para manter a ordem original
    return 0
  })
  return objetoOrdenado
}

const meses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export function sorteByMonths(data) {
  const objetoOrdenado = [...data].sort((a, b) => {
    // obtém o índice dos meses no array de meses
    const mesA = meses.indexOf(a[0])
    const mesB = meses.indexOf(b[0])

    // se mesA for maior que mesB, retorna um número negativo para colocar a antes de b
    if (mesA > mesB) {
      return -1
    }

    // se mesA for menor que mesB, retorna um número positivo para colocar b antes de a
    if (mesA < mesB) {
      return 1
    }

    // se mesA for igual a mesB, retorna zero para manter a ordem original
    return 0
  })
  return objetoOrdenado
}

export function sortByMonthAscending(monthsArray) {
  return monthsArray.sort((a, b) => {
    const monthA = meses.indexOf(a.month.toLowerCase())
    const monthB = meses.indexOf(b.month.toLowerCase())

    if (monthA < monthB) {
      return -1
    } else if (monthA > monthB) {
      return 1
    } else {
      return 0
    }
  })
}

export function defineProfiletext(
  profile: 'publisher' | 'baptized_publisher' | 'pioneer' | string,
) {
  if (profile === 'publisher') return 'Publicador'
  if (profile === 'baptized_publisher') return 'Batizado'
  if (profile === 'pioneer') return 'Pioneiro'
  return ''
}

export function capitalizeString(inputString) {
  if (inputString)
    return inputString.charAt(0).toUpperCase() + inputString.slice(1)
  else return ''
}

export function sortByYearMonthDay(data: any) {
  return data.sort((a, b) => {
    // Ordena por ano em ordem decrescente
    if (a.year !== b.year) {
      return b.year - a.year
    }

    // Ordena por mês em ordem decrescente (considerando o nome do mês)
    const monthOrder = {
      janeiro: 1,
      fevereiro: 2,
      março: 3,
      abril: 4,
      maio: 5,
      junho: 6,
      julho: 7,
      agosto: 8,
      setembro: 9,
      outubro: 10,
      novembro: 11,
      dezembro: 12,
    }
    if (monthOrder[a.month] !== monthOrder[b.month]) {
      return monthOrder[b.month] - monthOrder[a.month]
    }

    // Ordena por dia em ordem decrescente
    return b.day - a.day
  })
}
export function group_list_into_chunks(reportsFiltered: ReportData[]) {
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
  return data
}
export const best = {
  hours: {
    value: 0,
    month: '',
  },
  publications: {
    value: 0,
    month: '',
  },
  returnVisits: {
    value: 0,
    month: '',
  },
  students: {
    value: 0,
    month: '',
  },
  videos: {
    value: 0,
    month: '',
  },
}
export function bestMonthsStatics(data: any) {
  for (const iterator of data) {
    const [h] = String(iterator.reports.time).split(':')
    console.log(h)

    if (Number(h) > best.hours.value) {
      best.hours.value = Number(h)
      best.hours.month = iterator.month
    }
    if (iterator.reports.publications > best.publications.value) {
      best.publications.value = iterator.reports.publications
      best.publications.month = iterator.month
    }
    if (iterator.reports.returnVisits > best.returnVisits.value) {
      best.returnVisits.value = iterator.reports.returnVisits
      best.returnVisits.month = iterator.month
    }
    if (iterator.reports.students > best.students.value) {
      best.students.value = iterator.reports.students
      best.students.month = iterator.month
    }
    if (iterator.reports.videos > best.videos.value) {
      best.videos.value = iterator.reports.videos
      best.videos.month = iterator.month
    }
  }
  return best
}
