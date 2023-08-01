export function minutesToHoursAndMinutes(hour: number, minutes: number) {
  const hours = Math.floor(minutes / 60) + hour
  let remainingMinutes: number | string = minutes % 60

  if (remainingMinutes < 10) {
    remainingMinutes = '0' + remainingMinutes
  }
  return `${hours}:${remainingMinutes}`
}
