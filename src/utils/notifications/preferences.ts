export const LEAD_MINUTES = [15, 30, 60, 120] as const;
export const RHYTHM_DAYS = [7, 14, 30] as const;

export type LeadMinutes = (typeof LEAD_MINUTES)[number];
export type RhythmDays = (typeof RHYTHM_DAYS)[number];

export type MonthlyReminderConfig = {
  title: string;
  body: string;
  hour: number;
  minute: number;
  sound: boolean;
  vibration: boolean;
  enabled: boolean;
};

export type NotificationPreferences = {
  dailySummary: {
    enabled: boolean;
    hour: number;
    minute: number;
  };
  visitLeadMinutes: LeadMinutes;
  rhythm: {
    revisitDays: RhythmDays;
    studyDays: RhythmDays;
  };
  monthly: MonthlyReminderConfig;
  lastSync: string | null;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  dailySummary: { enabled: true, hour: 7, minute: 30 },
  visitLeadMinutes: 60,
  rhythm: { revisitDays: 7, studyDays: 7 },
  monthly: {
    title: 'Relatório do mês',
    body: 'Envie seu relatório do mês!',
    hour: 9,
    minute: 0,
    sound: true,
    vibration: false,
    enabled: true,
  },
  lastSync: null,
};

const LEAD_LABELS: Record<LeadMinutes, string> = {
  15: '15 minutos antes',
  30: '30 minutos antes',
  60: '1 hora antes',
  120: '2 horas antes',
};

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function formatLead(minutes: LeadMinutes): string {
  return LEAD_LABELS[minutes];
}

export function formatRhythm(days: RhythmDays): string {
  return `A cada ${days} dias`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hourOf(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 23
    ? value
    : fallback;
}

function minuteOf(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 59
    ? value
    : fallback;
}

function flag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function leadOf(value: unknown): LeadMinutes {
  return LEAD_MINUTES.includes(value as LeadMinutes)
    ? (value as LeadMinutes)
    : DEFAULT_NOTIFICATION_PREFERENCES.visitLeadMinutes;
}

function rhythmOf(value: unknown, fallback: RhythmDays): RhythmDays {
  return RHYTHM_DAYS.includes(value as RhythmDays) ? (value as RhythmDays) : fallback;
}

export function mergeNotificationPreferences(
  raw: string | undefined | null
): NotificationPreferences {
  const defaults = DEFAULT_NOTIFICATION_PREFERENCES;
  if (!raw) return defaults;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return defaults;

    const daily = isRecord(parsed.dailySummary) ? parsed.dailySummary : {};
    const rhythm = isRecord(parsed.rhythm) ? parsed.rhythm : {};
    const monthly = isRecord(parsed.monthly) ? parsed.monthly : {};

    return {
      dailySummary: {
        enabled: flag(daily.enabled, defaults.dailySummary.enabled),
        hour: hourOf(daily.hour, defaults.dailySummary.hour),
        minute: minuteOf(daily.minute, defaults.dailySummary.minute),
      },
      visitLeadMinutes: leadOf(parsed.visitLeadMinutes),
      rhythm: {
        revisitDays: rhythmOf(rhythm.revisitDays, defaults.rhythm.revisitDays),
        studyDays: rhythmOf(rhythm.studyDays, defaults.rhythm.studyDays),
      },
      monthly: {
        title: text(monthly.title, defaults.monthly.title),
        body: text(monthly.body, defaults.monthly.body),
        hour: hourOf(monthly.hour, defaults.monthly.hour),
        minute: minuteOf(monthly.minute, defaults.monthly.minute),
        sound: flag(monthly.sound, defaults.monthly.sound),
        vibration: flag(monthly.vibration, defaults.monthly.vibration),
        enabled: flag(monthly.enabled, defaults.monthly.enabled),
      },
      lastSync: typeof parsed.lastSync === 'string' ? parsed.lastSync : null,
    };
  } catch {
    return defaults;
  }
}
