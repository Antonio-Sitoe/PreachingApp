import dayjs, { type Dayjs } from 'dayjs';

export type YearMonth = { year: number; month: number };

// O ano de serviço vai de Setembro a Agosto.
export function serviceYearStart(date: Dayjs = dayjs()): number {
  return date.month() >= 8 ? date.year() : date.year() - 1;
}

// "2026/27".
export function serviceYearLabel(startYear: number): string {
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`;
}

export function serviceYearMonths(startYear: number): YearMonth[] {
  return Array.from({ length: 12 }, (_, index) => {
    const date = dayjs(new Date(startYear, 8 + index, 1));
    return { year: date.year(), month: date.month() + 1 };
  });
}

// Conta com o mês em curso.
export function monthsLeftInServiceYear(date: Dayjs = dayjs()): number {
  return 12 - ((date.month() + 4) % 12);
}
