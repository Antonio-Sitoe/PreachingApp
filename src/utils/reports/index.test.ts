import type { MonthReport } from '@/database/@types';
import {
  formatReportDetail,
  formatReportMonth,
  formatStudyNames,
  isCurrentMonth,
  reportHours,
  reportShareText,
  reportStatus,
} from '@/utils/reports';
import dayjs from 'dayjs';

const NOW = dayjs(new Date(2026, 9, 15));
const SENT_AT = new Date(2026, 9, 1, 10).toISOString();

const report = (overrides: Partial<MonthReport> = {}): MonthReport => ({
  year: 2026,
  month: 9,
  participated: false,
  participatedAuto: false,
  bibleStudies: 0,
  studiesAuto: 0,
  studyNames: [],
  minutes: 0,
  sentAt: null,
  sentHours: null,
  ...overrides,
});

const currentMonth = (overrides: Partial<MonthReport> = {}) => report({ month: 10, ...overrides });

describe('isCurrentMonth', () => {
  it('compara o mês e o ano', () => {
    expect(isCurrentMonth({ year: 2026, month: 10 }, NOW)).toBe(true);
    expect(isCurrentMonth({ year: 2026, month: 9 }, NOW)).toBe(false);
    expect(isCurrentMonth({ year: 2025, month: 10 }, NOW)).toBe(false);
  });
});

describe('reportStatus', () => {
  it('um relatório enviado fica enviado, mesmo no mês em curso', () => {
    expect(reportStatus(currentMonth({ sentAt: SENT_AT }), NOW)).toBe('sent');
  });

  it('o mês em curso fica por enviar, mesmo sem participação', () => {
    expect(reportStatus(currentMonth(), NOW)).toBe('pending');
  });

  it('um mês passado com participação fica por enviar', () => {
    expect(reportStatus(report({ participated: true }), NOW)).toBe('pending');
  });

  it('um mês passado sem participação fica não enviado', () => {
    expect(reportStatus(report(), NOW)).toBe('not_sent');
  });
});

describe('reportHours', () => {
  it.each([
    [0, 0],
    [59, 0],
    [60, 1],
    [119, 1],
    [1710, 28],
  ])('%i minutos dão %i horas inteiras', (minutes, hours) => {
    expect(reportHours(minutes)).toBe(hours);
  });
});

describe('formatReportMonth', () => {
  it('escreve o mês em português com maiúscula', () => {
    expect(formatReportMonth(2026, 10)).toBe('Outubro 2026');
  });
});

describe('formatReportDetail', () => {
  it('relatório enviado', () => {
    const sent = report({ sentAt: SENT_AT, bibleStudies: 3 });
    expect(formatReportDetail(sent, false, NOW)).toBe('Enviado a 1 de Outubro · 3 estudos');
  });

  it('um pioneiro vê as horas enviadas em vez das registadas', () => {
    const sent = report({ sentAt: SENT_AT, sentHours: 30, minutes: 1710, bibleStudies: 3 });
    expect(formatReportDetail(sent, true, NOW)).toBe('Enviado a 1 de Outubro · 30 h · 3 estudos');
  });

  it('mês em curso', () => {
    const open = currentMonth({ minutes: 1710, bibleStudies: 5 });
    expect(formatReportDetail(open, true, NOW)).toBe('Mês em curso · 28 h · 5 estudos até agora');
  });

  it('mês passado por enviar, com um só estudo', () => {
    const pending = report({ participated: true, bibleStudies: 1 });
    expect(formatReportDetail(pending, false, NOW)).toBe('Por enviar · 1 estudo');
  });

  it('mês passado sem participação', () => {
    expect(formatReportDetail(report(), false, NOW)).toBe('Sem participação registada · 0 estudos');
  });
});

describe('formatStudyNames', () => {
  it.each([
    [[], null],
    [['Celeste'], 'Celeste teve estudo em Outubro'],
    [['Celeste', 'Tomás'], 'Celeste e Tomás tiveram estudo em Outubro'],
    [['Celeste', 'Tomás', 'Júlia'], 'Celeste, Tomás e Júlia tiveram estudo em Outubro'],
  ])('%j', (names, text) => {
    expect(formatStudyNames(names, 'Outubro')).toBe(text);
  });
});

describe('reportShareText', () => {
  const october = currentMonth({ minutes: 1710, bibleStudies: 5, participated: true });

  it('pioneiro: leva as horas e o tipo', () => {
    const text = reportShareText({
      name: 'Daniel',
      typeLabel: 'Pioneiro auxiliar',
      pioneer: true,
      report: october,
    });
    expect(text).toBe(
      'Relatório de Outubro de 2026\nDaniel, pioneiro auxiliar\nHoras: 28\nEstudos bíblicos: 5'
    );
  });

  it('pioneiro: prefere as horas enviadas', () => {
    const text = reportShareText({
      name: 'Daniel',
      typeLabel: 'Pioneiro auxiliar',
      pioneer: true,
      report: { ...october, sentHours: 30 },
    });
    expect(text).toContain('Horas: 30');
  });

  it('publicador: leva a participação em vez das horas', () => {
    const text = reportShareText({
      name: 'Daniel',
      typeLabel: 'Publicador',
      pioneer: false,
      report: october,
    });
    expect(text).toBe(
      'Relatório de Outubro de 2026\nDaniel\nParticipei no ministério: sim\nEstudos bíblicos: 5'
    );
  });

  it('publicador sem participação e sem nome', () => {
    const text = reportShareText({
      name: '  ',
      typeLabel: 'Publicador',
      pioneer: false,
      report: { ...october, participated: false },
    });
    expect(text).toContain('Sem nome\nParticipei no ministério: não');
  });
});
