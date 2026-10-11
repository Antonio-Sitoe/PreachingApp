import type { AppIconName } from '@/components/ui/app-icon';
import {
  defaultMonthlyHourGoal,
  MONTHLY_HOUR_GOALS,
  PUBLISHER_TYPES,
  type Language,
  type PublisherType,
  type User,
} from '@/database/actions';


export type SetupProfile = {
  name: string;
  language: Language;
  publisherType: PublisherType;
  monthlyHourGoal: number | null;
};

export const DEFAULT_SETUP_PROFILE: SetupProfile = {
  name: '',
  language: 'pt',
  publisherType: 'publisher',
  monthlyHourGoal: null,
};

export function toSetupProfile(user: User): SetupProfile {
  return {
    name: user.name,
    language: user.language,
    publisherType: user.publisherType,
    monthlyHourGoal: user.monthlyHourGoal,
  };
}

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
];

export const PUBLISHER_TYPE_INFO: Record<PublisherType, { label: string; icon: AppIconName }> = {
  publisher: { label: 'Publicador', icon: 'user' },
  bethelite: { label: 'Betelita', icon: 'user' },
  auxiliary_pioneer: { label: 'Pioneiro auxiliar', icon: 'calendar' },
  circuit_overseer: { label: 'Superintendente de circuito', icon: 'clock' },
  regular_pioneer: { label: 'Pioneiro regular', icon: 'clock' },
  special_pioneer: { label: 'Pioneiro especial', icon: 'clock' },
  missionary: { label: 'Missionário', icon: 'clock' },
};

export type PublisherTypeOption = {
  key: string;
  publisherType: PublisherType;
  monthlyHourGoal: number | null;
  label: string;
  goalLabel: string;
  description: string;
  icon: AppIconName;
};

function toOption(publisherType: PublisherType, monthlyHourGoal: number | null) {
  const { label, icon } = PUBLISHER_TYPE_INFO[publisherType];
  return {
    key: `${publisherType}:${monthlyHourGoal ?? 'none'}`,
    publisherType,
    monthlyHourGoal,
    label,
    icon,
    goalLabel: monthlyHourGoal === null ? 'Sem horas' : `${monthlyHourGoal} h por mês`,
    description:
      monthlyHourGoal === null
        ? 'Sem horas: participei e número de estudos'
        : `Horas com meta do mês: ${monthlyHourGoal} h`,
  } satisfies PublisherTypeOption;
}

export const PUBLISHER_TYPE_OPTIONS: PublisherTypeOption[] = PUBLISHER_TYPES.flatMap((type) => {
  const goals = MONTHLY_HOUR_GOALS[type];
  return goals.length === 0 ? [toOption(type, null)] : goals.map((goal) => toOption(type, goal));
});

export function findPublisherTypeOption(
  publisherType: PublisherType,
  monthlyHourGoal: number | null
): PublisherTypeOption {
  const ofType = PUBLISHER_TYPE_OPTIONS.filter((option) => option.publisherType === publisherType);
  return (
    ofType.find((option) => option.monthlyHourGoal === monthlyHourGoal) ??
    ofType.find((option) => option.monthlyHourGoal === defaultMonthlyHourGoal(publisherType)) ??
    ofType[0]
  );
}
