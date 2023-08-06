export function minutesToHoursAndMinutes(hour: number, minutes: number) {
  const hours = Math.floor(minutes / 60) + hour
  let remainingMinutes: number | string = minutes % 60

  if (remainingMinutes < 10) {
    remainingMinutes = '0' + remainingMinutes
  }
  return `${hours}:${remainingMinutes}`
}

export function monthNameToPortuguese(monthName: string) {
  const monthsMapping = {
    January: 'janeiro',
    February: 'fevereiro',
    March: 'março',
    April: 'abril',
    May: 'maio',
    June: 'junho',
    July: 'julho',
    August: 'agosto',
    September: 'setembro',
    October: 'outubro',
    November: 'novembro',
    December: 'dezembro',
  }

  return monthsMapping[monthName] || monthName
}
