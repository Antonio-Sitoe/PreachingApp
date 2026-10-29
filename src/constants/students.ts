import type { AppointmentTimeOfDay, StudentStage } from '@/database/schemas';

export const STUDENT_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'revisits', label: 'Revisitas' },
  { id: 'studying', label: 'Em estudo' },
  { id: 'paused', label: 'Em pausa' },
] as const;

export type StudentFilter = (typeof STUDENT_FILTERS)[number]['id'];

export const STUDENT_SORTS = [
  { id: 'next-visit', label: 'Próxima visita', summary: 'próxima visita' },
  { id: 'name', label: 'Nome', summary: 'nome' },
  { id: 'last-visit-desc', label: 'Última visita: mais recentes', summary: 'última visita' },
  { id: 'last-visit-asc', label: 'Última visita: mais antigas', summary: 'última visita' },
  { id: 'created', label: 'Data de registo', summary: 'data de registo' },
] as const;

export type StudentSort = (typeof STUDENT_SORTS)[number]['id'];

export const REVISIT_STAGES: readonly StudentStage[] = ['first_contact', 'return_visit'];

export const TIMES_OF_DAY: readonly { value: AppointmentTimeOfDay; label: string }[] = [
  { value: 'any', label: 'Qualquer' },
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
];

export const TIME_OF_DAY_SUFFIX: Record<AppointmentTimeOfDay, string> = {
  any: '',
  morning: ', de manhã',
  afternoon: ', à tarde',
  evening: ', à noite',
};
