import { monthNameToPortuguese } from '@/utils/dates';
import dayjs from 'dayjs';
import '@/lib/dayjs';

export function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function reportDateLabel(date: string) {
  return capitalize(dayjs(date).format('dddd, D [de] MMMM [de] YYYY'));
}

export function monthHeading(month: number, year: number) {
  return `${capitalize(monthNameToPortuguese(month))} ${year}`;
}

export function monthShareText(input: {
  name: string;
  month: number;
  year: number;
  time: string;
  students: number;
}) {
  return [
    `Relatório de ${input.name}`,
    `${capitalize(monthNameToPortuguese(input.month))} de ${input.year}`,
    `Horas: ${input.time}`,
    `Estudos: ${input.students}`,
  ].join('\n');
}

export function shiftDate(date: string, days: number) {
  return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
}
