import type { StudentStage, StudentStatus } from '@/database/schemas';

type StageStyle = { label: string; textClass: string; bgClass: string };

export const STAGES = {
  first_contact: {
    label: 'Primeiro contacto',
    textClass: 'text-stage-contact',
    bgClass: 'bg-stage-contact-soft',
  },
  return_visit: {
    label: 'Revisita',
    textClass: 'text-stage-revisit',
    bgClass: 'bg-stage-revisit-soft',
  },
  study_started: {
    label: 'Estudo iniciado',
    textClass: 'text-stage-started',
    bgClass: 'bg-stage-started-soft',
  },
  regular_study: {
    label: 'Estudo regular',
    textClass: 'text-stage-regular',
    bgClass: 'bg-stage-regular-soft',
  },
  unbaptized_publisher: {
    label: 'Publicador não batizado',
    textClass: 'text-stage-publisher',
    bgClass: 'bg-stage-publisher-soft',
  },
  baptized: {
    label: 'Batizado',
    textClass: 'text-stage-baptized',
    bgClass: 'bg-stage-baptized-soft',
  },
} as const satisfies Record<StudentStage, StageStyle>;

export type Stage = StudentStage;

export const STAGE_ORDER = Object.keys(STAGES) as Stage[];

export const PAUSED_STYLE = {
  label: 'Em pausa',
  textClass: 'text-stage-paused',
  bgClass: 'bg-stage-paused-soft',
} as const satisfies StageStyle;

export const STATUS_LABELS: Record<StudentStatus, string> = {
  active: 'Activo',
  paused: 'Em pausa',
  closed: 'Encerrado',
};
