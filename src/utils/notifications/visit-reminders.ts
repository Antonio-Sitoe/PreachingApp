import { appointmentsActions, type ReminderTarget } from '@/database/actions';
import { shortName } from '@/utils/students/journey';
import { withTime } from '@/utils/visits/format';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'visit-reminders';
const PREFIX = 'visit-reminder-';

export type VisitReminderData = { type: 'visit-reminder'; studentId: string };

/** "à Celeste", "ao Tomás"; sem género conhecido, "a Mito". */
function toName(target: ReminderTarget): string {
  const name = shortName(target.studentName);
  if (target.studentGender === 'female') return `à ${name}`;
  if (target.studentGender === 'male') return `ao ${name}`;
  return `a ${name}`;
}

/** "Visita à Celeste daqui a 1 hora" */
export function reminderTitle(target: ReminderTarget): string {
  const visit = `Visita ${toName(target)}`;
  const minutes = target.remindMinutesBefore;
  if (minutes <= 0) return `${visit} agora`;
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${visit} daqui a ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  return `${visit} daqui a ${minutes} minutos`;
}

/** "10:00 · lição 14 · levar a brochura" */
export function reminderBody(target: ReminderTarget): string {
  return [
    target.time,
    target.lastLesson ? `lição ${target.lastLesson}` : null,
    target.promisedToBring ? `levar ${target.promisedToBring}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function reminderDate(target: ReminderTarget): Date {
  return dayjs(withTime(new Date(target.scheduledAt), target.time))
    .subtract(target.remindMinutesBefore, 'minute')
    .toDate();
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

/** Volta a agendar todos os lembretes a partir das marcações; as que mudaram ficam certas. */
export async function syncVisitReminders(): Promise<void> {
  await cancelAll();
  const targets = await appointmentsActions.getReminderTargets();
  const now = Date.now();
  const due = targets.filter((target) => reminderDate(target).getTime() > now);
  if (due.length === 0) return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes de visita',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });

  for (const target of due) {
    const data: VisitReminderData = { type: 'visit-reminder', studentId: target.studentId };
    await Notifications.scheduleNotificationAsync({
      identifier: `${PREFIX}${target.appointmentId}`,
      content: {
        title: reminderTitle(target),
        body: reminderBody(target),
        data,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate(target),
        channelId: CHANNEL_ID,
      },
    });
  }
}

export function isVisitReminder(data: unknown): data is VisitReminderData {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === 'visit-reminder' &&
    typeof (data as { studentId?: unknown }).studentId === 'string'
  );
}
