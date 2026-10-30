import { todayActions, type TodayData } from '@/database/actions';
import { formatRhythm } from '@/utils/students/detail';
import { shortName } from '@/utils/students/journey';
import type { NotificationPreferences } from '@/utils/notifications/preferences';
import { formatDaysAgo } from '@/utils/today/format';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'daily-summary';
const PREFIX = 'daily-summary-';
const DAYS_AHEAD = 7;

export type DailySummaryData = { type: 'daily-summary' };

function joinWithE(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/** O título e o texto da notificação de um dia, ou `null` se não houver nada a dizer. */
export function dailySummaryContent(data: TodayData): { title: string; body: string } | null {
  const visits = data.today;
  const late = data.overdue.length;
  const rhythm = data.outOfRhythm;

  if (visits.length > 0) {
    const names = visits.map(({ student, appointment }) =>
      appointment.time
        ? `${shortName(student.displayName)} às ${appointment.time}`
        : shortName(student.displayName)
    );
    const extras = [
      late > 0 ? `${late} em atraso` : null,
      rhythm.length > 0 ? `${rhythm.length} a sair do ritmo` : null,
    ].filter(Boolean);
    return {
      title: visits.length === 1 ? 'Hoje tens 1 visita' : `Hoje tens ${visits.length} visitas`,
      body: [joinWithE(names), ...extras].join(' · '),
    };
  }

  if (late > 0) {
    return {
      title: late === 1 ? 'Tens 1 visita em atraso' : `Tens ${late} visitas em atraso`,
      body: joinWithE(
        data.overdue.slice(0, 3).map(({ student }) => shortName(student.displayName))
      ),
    };
  }

  if (rhythm.length === 1) {
    const [item] = rhythm;
    return {
      title: `${shortName(item.student.displayName)} está a sair do ritmo`,
      body: `${formatRhythm(item.student.rhythmDays)} · ${
        item.lastMet ? 'última visita' : 'registado'
      } ${formatDaysAgo(item.daysSince)}`,
    };
  }

  if (rhythm.length > 1) {
    return {
      title: `${rhythm.length} estudantes a sair do ritmo`,
      body: joinWithE(rhythm.slice(0, 3).map(({ student }) => shortName(student.displayName))),
    };
  }

  return null;
}

async function cancelAll(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((notification) => notification.identifier.startsWith(PREFIX))
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );
}

/** Agenda a notificação dos próximos dias, cada uma com as visitas desse dia. */
export async function syncDailySummary(
  config: NotificationPreferences['dailySummary']
): Promise<void> {
  await cancelAll();
  if (!config.enabled) return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Resumo do dia',
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  const now = dayjs();
  for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
    const at = now
      .add(offset, 'day')
      .hour(config.hour)
      .minute(config.minute)
      .second(0)
      .millisecond(0);
    if (!at.isAfter(now)) continue;

    const content = dailySummaryContent(await todayActions.getToday(at));
    if (!content) continue;

    const data: DailySummaryData = { type: 'daily-summary' };
    await Notifications.scheduleNotificationAsync({
      identifier: `${PREFIX}${at.format('YYYY-MM-DD')}`,
      content: { ...content, data },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at.toDate(),
        channelId: CHANNEL_ID,
      },
    });
  }
}

export function isDailySummary(data: unknown): data is DailySummaryData {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === 'daily-summary'
  );
}
