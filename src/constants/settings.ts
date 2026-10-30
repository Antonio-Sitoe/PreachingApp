import type { Language } from '@/database/schemas';
import type { ListView, ThemePreference } from '@/utils/storage';

export const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Do sistema' },
];

export const LIST_VIEW_OPTIONS: readonly { value: ListView; label: string }[] = [
  { value: 'list', label: 'Lista' },
  { value: 'cards', label: 'Cartões' },
];

export const LANGUAGE_LABELS: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
};

export const LOCK_HINT =
  'O bloqueio protege os dados dos estudantes se alguém pegar no teu telemóvel.';

export const EXACT_ALARM_HINT =
  'Sem esta permissão o Android pode atrasar os lembretes alguns minutos ou mais. Ativa em Alarmes e lembretes.';
export const RHYTHM_HINT =
  'Quando alguém passa deste intervalo sem visita, aparece nos alertas do Hoje. Cada estudante pode ter o seu próprio ritmo.';
export const RHYTHM_SHEET_HINT =
  'Vale para os estudantes novos. Quem já tem ritmo próprio não muda.';

export const USAGE_SENT = [
  'Dias em que abriste o app',
  'Visitas registadas',
  'Estudantes criados',
  'Lições concluídas',
];
export const USAGE_NEVER_SENT = [
  'Nomes, contactos e moradas',
  'O que escreves nas visitas e nas notas',
  'A tua localização',
];

export const EMOLA_NUMBER = '87 898 4953';
