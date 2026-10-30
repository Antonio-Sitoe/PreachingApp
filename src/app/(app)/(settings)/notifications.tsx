import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/components/settings/grouped-list';
import { ChoiceRow } from '@/components/settings/choice-row';
import { RhythmSheet } from '@/components/settings/rhythm-sheet';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { EXACT_ALARM_HINT, RHYTHM_HINT, RHYTHM_SHEET_HINT } from '@/constants/settings';
import {
  formatLead,
  formatRhythm,
  formatTime,
  LEAD_MINUTES,
  type LeadMinutes,
  type MonthlyReminderConfig,
  type NotificationPreferences,
} from '@/utils/notifications/preferences';
import {
  checkPermission,
  openAppSettings,
  requestPermission,
  type PermissionStatus,
} from '@/utils/permissions';
import { getNotificationPreferences, setNotificationPreferences } from '@/utils/storage';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, ScrollView, View } from 'react-native';

type TimeTarget = 'daily' | 'monthly';
type RhythmTarget = 'revisit' | 'study';

type Sheet = { kind: 'lead' } | { kind: 'rhythm'; target: RhythmTarget } | { kind: 'title' } | null;

function timeDate(hour: number, minute: number): Date {
  return new Date(2020, 0, 1, hour, minute, 0, 0);
}

export default function NotificationsScreen() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [titleDraft, setTitleDraft] = useState(prefs.monthly.title);
  const [timePicker, setTimePicker] = useState<{ target: TimeTarget; date: Date } | null>(null);
  const [exactAlarm, setExactAlarm] = useState<PermissionStatus>('granted');

  const refreshExactAlarm = useCallback(async () => {
    setExactAlarm(await checkPermission('exactAlarm'));
  }, []);

  useEffect(() => {
    refreshExactAlarm();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshExactAlarm();
    });
    return () => subscription.remove();
  }, [refreshExactAlarm]);

  function persist(next: NotificationPreferences) {
    setNotificationPreferences(next);
    setPrefs(next);
    void syncAllNotifications();
  }

  async function saveMonthly(patch: Partial<MonthlyReminderConfig>) {
    const current = getNotificationPreferences();
    persist({ ...current, monthly: { ...current.monthly, ...patch } });
    await syncAllNotifications();
  }

  async function setMonthlyEnabled(enabled: boolean) {
    if (enabled) {
      const status = await requestPermission('notifications');
      if (status !== 'granted') {
        showToast({
          message: 'Para lembrar o relatório, permite as notificações nas definições do telemóvel.',
          action: { label: 'Definições', onPress: () => openAppSettings() },
        });
        return;
      }
    }
    await saveMonthly({ enabled });
  }

  function openTime(target: TimeTarget) {
    const source = target === 'daily' ? prefs.dailySummary : prefs.monthly;
    setTimePicker({ target, date: timeDate(source.hour, source.minute) });
  }

  function commitTime(target: TimeTarget, date: Date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (target === 'daily') {
      const current = getNotificationPreferences();
      persist({ ...current, dailySummary: { ...current.dailySummary, hour, minute } });
      return;
    }
    void saveMonthly({ hour, minute });
  }

  function onTimeValueChange(_event: DateTimePickerChangeEvent, date: Date) {
    const target = timePicker?.target;
    setTimePicker(null);
    if (!target) return;
    commitTime(target, date);
  }

  function onTimeDismiss() {
    setTimePicker(null);
  }

  function saveLead(minutes: LeadMinutes) {
    persist({ ...getNotificationPreferences(), visitLeadMinutes: minutes });
    setSheet(null);
  }

  function saveRhythm(days: number) {
    if (sheet?.kind !== 'rhythm') return;
    const current = getNotificationPreferences();
    persist({
      ...current,
      rhythm: {
        ...current.rhythm,
        ...(sheet.target === 'revisit' ? { revisitDays: days } : { studyDays: days }),
      },
    });
    setSheet(null);
  }

  function saveTitle() {
    const title = titleDraft.trim();
    if (!title) return;
    setSheet(null);
    void saveMonthly({ title });
  }

  const rhythmDays =
    sheet?.kind === 'rhythm' && sheet.target === 'study'
      ? prefs.rhythm.studyDays
      : prefs.rhythm.revisitDays;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Notificações" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="w-full max-w-[640px] gap-4 self-center px-4 pb-8 pt-4">
        {exactAlarm !== 'granted' ? (
          <SettingsSection title="Lembretes à hora certa" hint={EXACT_ALARM_HINT}>
            <SettingsRow
              first
              title="Alarmes e lembretes"
              value="Desligado"
              onPress={() => {
                void requestPermission('exactAlarm');
              }}
            />
          </SettingsSection>
        ) : null}

        <SettingsSection title="Notificação do dia">
          <SettingsRow
            first
            title="Resumo das visitas de hoje"
            trailing={
              <SettingsSwitch
                label="Resumo das visitas de hoje"
                value={prefs.dailySummary.enabled}
                onValueChange={(enabled) => {
                  const current = getNotificationPreferences();
                  persist({ ...current, dailySummary: { ...current.dailySummary, enabled } });
                }}
              />
            }
          />
          <SettingsRow
            title="Hora"
            value={formatTime(prefs.dailySummary.hour, prefs.dailySummary.minute)}
            onPress={() => openTime('daily')}
          />
        </SettingsSection>

        <SettingsSection title="Lembrete de visita">
          <SettingsRow
            first
            title="Avisar"
            value={formatLead(prefs.visitLeadMinutes)}
            onPress={() => setSheet({ kind: 'lead' })}
          />
        </SettingsSection>

        <SettingsSection title="Ritmo por omissão" hint={RHYTHM_HINT}>
          <SettingsRow
            first
            title="Revisitas"
            value={formatRhythm(prefs.rhythm.revisitDays)}
            onPress={() => setSheet({ kind: 'rhythm', target: 'revisit' })}
          />
          <SettingsRow
            title="Estudos"
            value={formatRhythm(prefs.rhythm.studyDays)}
            onPress={() => setSheet({ kind: 'rhythm', target: 'study' })}
          />
        </SettingsSection>

        <SettingsSection title="Lembrete do relatório mensal">
          <SettingsRow
            first
            title="Lembrar no dia 1 de cada mês"
            trailing={
              <SettingsSwitch
                label="Lembrar no dia 1 de cada mês"
                value={prefs.monthly.enabled}
                onValueChange={(enabled) => {
                  void setMonthlyEnabled(enabled);
                }}
              />
            }
          />
          <SettingsRow
            title="Horário"
            value={formatTime(prefs.monthly.hour, prefs.monthly.minute)}
            onPress={() => openTime('monthly')}
          />
          <SettingsRow
            title="Título"
            value={prefs.monthly.title}
            onPress={() => {
              setTitleDraft(prefs.monthly.title);
              setSheet({ kind: 'title' });
            }}
          />
          <SettingsRow
            title="Som"
            trailing={
              <SettingsSwitch
                label="Som"
                value={prefs.monthly.sound}
                onValueChange={(sound) => {
                  void saveMonthly({ sound });
                }}
              />
            }
          />
          <SettingsRow
            title="Vibração"
            trailing={
              <SettingsSwitch
                label="Vibração"
                value={prefs.monthly.vibration}
                onValueChange={(vibration) => {
                  void saveMonthly({ vibration });
                }}
              />
            }
          />
        </SettingsSection>
      </ScrollView>

      {timePicker ? (
        <DateTimePicker
          value={timePicker.date}
          mode="time"
          is24Hour
          display="default"
          onValueChange={onTimeValueChange}
          onDismiss={onTimeDismiss}
        />
      ) : null}

      <BottomSheet open={sheet?.kind === 'lead'} onClose={() => setSheet(null)} title="Avisar">
        {LEAD_MINUTES.map((minutes) => (
          <ChoiceRow
            key={minutes}
            label={formatLead(minutes)}
            selected={prefs.visitLeadMinutes === minutes}
            onPress={() => saveLead(minutes)}
          />
        ))}
      </BottomSheet>

      <RhythmSheet
        open={sheet?.kind === 'rhythm'}
        onClose={() => setSheet(null)}
        title={
          sheet?.kind === 'rhythm' && sheet.target === 'study'
            ? 'Ritmo dos estudos'
            : 'Ritmo das revisitas'
        }
        days={rhythmDays}
        hint={RHYTHM_SHEET_HINT}
        onSave={saveRhythm}
      />

      <BottomSheet open={sheet?.kind === 'title'} onClose={() => setSheet(null)} title="Título">
        <TextField label="Título da notificação" value={titleDraft} onChangeText={setTitleDraft} />
        <Button onPress={saveTitle}>
          <Text>Guardar</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}
