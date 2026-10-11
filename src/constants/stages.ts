export const STAGES = {
  contact: {
    label: 'Primeiro contacto',
    textClass: 'text-stage-contact',
    bgClass: 'bg-stage-contact-soft',
  },
  revisit: {
    label: 'Revisita',
    textClass: 'text-stage-revisit',
    bgClass: 'bg-stage-revisit-soft',
  },
  started: {
    label: 'Estudo iniciado',
    textClass: 'text-stage-started',
    bgClass: 'bg-stage-started-soft',
  },
  regular: {
    label: 'Estudo regular',
    textClass: 'text-stage-regular',
    bgClass: 'bg-stage-regular-soft',
  },
  publisher: {
    label: 'Publicador não batizado',
    textClass: 'text-stage-publisher',
    bgClass: 'bg-stage-publisher-soft',
  },
  baptized: {
    label: 'Batizado',
    textClass: 'text-stage-baptized',
    bgClass: 'bg-stage-baptized-soft',
  },
  paused: {
    label: 'Em pausa',
    textClass: 'text-stage-paused',
    bgClass: 'bg-stage-paused-soft',
  },
} as const;

export type Stage = keyof typeof STAGES;

export const STAGE_ORDER = Object.keys(STAGES) as Stage[];
