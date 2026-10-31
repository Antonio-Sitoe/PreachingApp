import { capitalize } from '@/components/reports/format';
import type { MonthReport } from '@/database/actions/monthly-reports';
import { formatMonthName } from '@/utils/hours/format';
import dayjs from 'dayjs';

export type ReportStatus = 'sent' | 'pending' | 'not_sent';

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  sent: 'Enviado',
  pending: 'Por enviar',
  not_sent: 'Não enviado',
};

export function isCurrentMonth(report: Pick<MonthReport, 'year' | 'month'>, now = dayjs()) {
  return report.year === now.year() && report.month === now.month() + 1;
}

export function reportStatus(report: MonthReport, now = dayjs()): ReportStatus {
  if (report.sentAt) return 'sent';
  if (isCurrentMonth(report, now) || report.participated) return 'pending';
  return 'not_sent';
}

// Horas inteiras: o relatório não leva minutos.
export function reportHours(minutes: number): number {
  return Math.floor(minutes / 60);
}

// "Outubro 2026".
export function formatReportMonth(year: number, month: number): string {
  return `${formatMonthName(year, month)} ${year}`;
}

const studiesLabel = (count: number) => `${count} ${count === 1 ? 'estudo' : 'estudos'}`;

// "Enviado a 1 de Outubro · 3 estudos" ou "Mês em curso · 28 h · 5 estudos".
export function formatReportDetail(report: MonthReport, pioneer: boolean, now = dayjs()): string {
  const status = reportStatus(report, now);
  const lead =
    status === 'sent'
      ? `Enviado a ${dayjs(report.sentAt).date()} de ${capitalize(dayjs(report.sentAt).format('MMMM'))}`
      : isCurrentMonth(report, now)
        ? 'Mês em curso'
        : report.participated
          ? 'Por enviar'
          : 'Sem participação registada';
  const hours = pioneer ? `${report.sentHours ?? reportHours(report.minutes)} h · ` : '';
  const studies =
    isCurrentMonth(report, now) && status !== 'sent'
      ? `${studiesLabel(report.bibleStudies)} até agora`
      : studiesLabel(report.bibleStudies);
  return `${lead} · ${hours}${studies}`;
}

// "Celeste, Tomás e Júlia tiveram estudo em Outubro".
export function formatStudyNames(names: string[], monthName: string): string | null {
  if (names.length === 0) return null;
  const list =
    names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
  return `${list} ${names.length === 1 ? 'teve' : 'tiveram'} estudo em ${monthName}`;
}

type ShareInput = {
  name: string;
  typeLabel: string;
  pioneer: boolean;
  report: MonthReport;
};

// "Relatório de Outubro de 2026\nDaniel, pioneiro auxiliar\nHoras: 28\nEstudos bíblicos: 5".
export function reportShareText({ name, typeLabel, pioneer, report }: ShareInput): string {
  const title = `Relatório de ${formatMonthName(report.year, report.month)} de ${report.year}`;
  const who = name.trim() || 'Sem nome';
  const lines = pioneer
    ? [
        title,
        `${who}, ${typeLabel.toLowerCase()}`,
        `Horas: ${report.sentHours ?? reportHours(report.minutes)}`,
        `Estudos bíblicos: ${report.bibleStudies}`,
      ]
    : [
        title,
        who,
        `Participei no ministério: ${report.participated ? 'sim' : 'não'}`,
        `Estudos bíblicos: ${report.bibleStudies}`,
      ];
  return lines.join('\n');
}
