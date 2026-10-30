import { capitalize } from '@/components/reports/format';
import { STAGE_ORDER, STAGES, type Stage } from '@/constants/stages';
import type { StageChange, StudentGender } from '@/database/schemas';
import dayjs from 'dayjs';
import '@/lib/dayjs';
import { weekdayName } from './return-date';

export type StageStepState = 'done' | 'current' | 'next';

export type StageStep = {
  stage: Stage;
  label: string;
  state: StageStepState;
  /** "2 de Março de 2026", ou "Desde 8 de Junho de 2026" na etapa actual. */
  date: string | null;
};

/** "2 de Março de 2026" */
export function formatLongDate(date: string | Date): string {
  const day = dayjs(date);
  return `${day.date()} de ${capitalize(day.format('MMMM'))} de ${day.year()}`;
}

/** "17 Mai 2026" */
export function formatShortDate(date: string | Date): string {
  const day = dayjs(date);
  return `${day.date()} ${capitalize(day.format('MMMM').slice(0, 3))} ${day.year()}`;
}

/** "Hoje, 5 Out", "Sáb, 3 Out" */
export function formatPickedDay(date: Date): string {
  const day = dayjs(date);
  const month = capitalize(day.format('MMMM').slice(0, 3));
  const prefix = day.isSame(dayjs(), 'day') ? 'Hoje' : capitalize(weekdayName(day).slice(0, 3));
  return `${prefix}, ${day.date()} ${month}`;
}

export function buildStageSteps(current: Stage, changes: readonly StageChange[]): StageStep[] {
  // A última vez que o estudante entrou em cada etapa.
  const reachedAt = new Map<Stage, string>();
  for (const change of changes) reachedAt.set(change.toStage, change.changedAt);

  const currentIndex = STAGE_ORDER.indexOf(current);
  return STAGE_ORDER.map((stage, index) => {
    const at = reachedAt.get(stage);
    const state: StageStepState =
      index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'next';
    const date =
      state === 'next' || !at
        ? null
        : state === 'current'
          ? `Desde ${formatLongDate(at)}`
          : formatLongDate(at);
    return { stage, label: STAGES[stage].label, state, date };
  });
}

export function getNextStage(stage: Stage): Stage | null {
  return STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1] ?? null;
}

/** "Passar a publicador não batizado" */
export function formatAdvanceLabel(stage: Stage): string {
  const label = STAGES[stage].label;
  return `Passar a ${label.charAt(0).toLocaleLowerCase('pt')}${label.slice(1)}`;
}

const ARTICLE: Record<StudentGender, string> = { female: 'da', male: 'do' };

const HONORIFICS = new Set([
  'sr',
  'sra',
  'srª',
  'd',
  'dona',
  'dr',
  'dra',
  'tio',
  'tia',
  'mamã',
  'papá',
]);

/** "Celeste Nhantumbo" → "Celeste"; "Sr. Mário" → "Sr. Mário", para não ficar só o tratamento. */
export function shortName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? '';
  const isHonorific = first.endsWith('.') || HONORIFICS.has(first.toLocaleLowerCase('pt'));
  return isHonorific && words[1] ? `${first} ${words[1]}` : first;
}

/** "a Celeste", "o Tomás"; sem género conhecido, só o nome. */
export function withArticle(name: string, gender: StudentGender | null): string {
  const short = shortName(name);
  return gender ? `${gender === 'female' ? 'a' : 'o'} ${short}` : short;
}

/** "da Celeste", "do Tomás"; sem género conhecido, "de Mito". */
export function ofName(name: string, gender: StudentGender | null): string {
  return `${gender ? ARTICLE[gender] : 'de'} ${shortName(name)}`;
}

/** "Percurso da Celeste"; sem género conhecido, "de". */
export function formatJourneyTitle(name: string, gender: StudentGender | null): string {
  return shortName(name) ? `Percurso ${ofName(name, gender)}` : 'Percurso';
}

export const MILESTONE_EXAMPLES = [
  'Primeira reunião assistida',
  'Primeiro comentário',
  'Primeiro discurso',
  'Primeiro convívio',
] as const;
