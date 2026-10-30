import type {
  AppointmentTimeOfDay,
  PauseReason,
  StudentAgeRange,
  StudentGender,
  StudentStage,
} from '@/database/schemas';

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

export const AGE_RANGE_OPTIONS: readonly { value: StudentAgeRange; label: string }[] = [
  { value: '5_15', label: '5 a 15' },
  { value: '16_30', label: '16 a 30' },
  { value: '31_45', label: '31 a 45' },
  { value: 'over_45', label: 'Mais de 45' },
];

export const GENDER_OPTIONS: readonly { value: StudentGender; label: string }[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
];

/** 1 (segunda) a 7 (domingo), como em `student_availabilities.weekday`. */
export const WEEKDAY_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
  { value: 7, label: 'Dom' },
];

export const PAUSE_REASON_OPTIONS: readonly { value: PauseReason; label: string }[] = [
  { value: 'travelled', label: 'Viajou' },
  { value: 'asked_to_stop', label: 'Pediu para parar' },
  { value: 'unavailable', label: 'Sem disponibilidade' },
  { value: 'other', label: 'Outro' },
];
