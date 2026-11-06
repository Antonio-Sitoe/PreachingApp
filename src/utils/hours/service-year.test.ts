import {
  monthsLeftInServiceYear,
  serviceYearLabel,
  serviceYearMonths,
  serviceYearStart,
} from '@/utils/hours/service-year';
import dayjs from 'dayjs';

const on = (year: number, month: number, day = 1) => dayjs(new Date(year, month - 1, day));

describe('serviceYearStart', () => {
  it.each([
    ['31 de Agosto', on(2026, 8, 31), 2025],
    ['1 de Setembro', on(2026, 9, 1), 2026],
    ['31 de Dezembro', on(2026, 12, 31), 2026],
    ['1 de Janeiro', on(2027, 1, 1), 2026],
  ])('%s', (_label, date, start) => {
    expect(serviceYearStart(date)).toBe(start);
  });
});

describe('serviceYearLabel', () => {
  it.each([
    [2026, '2026/27'],
    [2008, '2008/09'],
    [2099, '2099/00'],
  ])('%i', (start, label) => {
    expect(serviceYearLabel(start)).toBe(label);
  });
});

describe('serviceYearMonths', () => {
  it('vai de Setembro a Agosto do ano seguinte', () => {
    const months = serviceYearMonths(2026);
    expect(months).toHaveLength(12);
    expect(months[0]).toEqual({ year: 2026, month: 9 });
    expect(months[3]).toEqual({ year: 2026, month: 12 });
    expect(months[4]).toEqual({ year: 2027, month: 1 });
    expect(months[11]).toEqual({ year: 2027, month: 8 });
  });
});

describe('monthsLeftInServiceYear', () => {
  it.each([
    ['Setembro', on(2026, 9), 12],
    ['Dezembro', on(2026, 12), 9],
    ['Janeiro', on(2027, 1), 8],
    ['Agosto', on(2027, 8), 1],
  ])('%s conta com o mês em curso', (_label, date, left) => {
    expect(monthsLeftInServiceYear(date)).toBe(left);
  });
});
