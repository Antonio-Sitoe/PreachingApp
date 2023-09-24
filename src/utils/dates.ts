import dayjs from 'dayjs'

export function minutesToHoursAndMinutes(hour: number, minutes: number) {
  const hours = Math.floor(minutes / 60) + hour
  let remainingMinutes: number | string = minutes % 60

  if (remainingMinutes < 10) {
    remainingMinutes = '0' + remainingMinutes
  }
  return `${hours}:${remainingMinutes}`
}
export function calculateHoursAndMinutes(hour: number, minutes: number) {
  const hours = Math.floor(minutes / 60) + hour
  const remainingMinutes: number | string = minutes % 60

  return { hours, remainingMinutes }
}

export function monthNameToPortuguese(monthName: number) {
  const monthsMapping = {
    1: 'janeiro',
    2: 'fevereiro',
    3: 'março',
    4: 'abril',
    5: 'maio',
    6: 'junho',
    7: 'julho',
    8: 'agosto',
    9: 'setembro',
    10: 'outubro',
    11: 'novembro',
    12: 'dezembro',
  }

  return monthsMapping[monthName] || monthName
}

export const currentDates = {
  month: monthNameToPortuguese(dayjs().get('month') + 1),
  year: dayjs().get('y'),
}

export function generateLast6MonthsNames() {
  const monthsLates: string[] = []
  let currentMonth = dayjs().get('month') + 1

  for (let i = 0; i < 6; i++) {
    monthsLates.push(monthNameToPortuguese(currentMonth))
    currentMonth = currentMonth - 1
  }

  return monthsLates.reverse()
}
