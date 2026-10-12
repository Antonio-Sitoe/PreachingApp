import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/components/settings/grouped-list';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { AppIcon } from '@/components/ui/app-icon';
import { showToast } from '@/components/ui/toast';
import {
  formatLead,
  formatRhythm,
  formatTime,
  LEAD_MINUTES,
  RHYTHM_DAYS,
  type LeadMinutes,
  type MonthlyReminderConfig,
  type NotificationPreferences,
  type RhythmDays,
} from '@/utils/notifications/preferences';
import {
  checkPermission,
  openAppSettings,
  requestPermission,
  type PermissionStatus,
} from '@/utils/permissions';
import { getNotificationPreferences, setNotificationPreferences } from '@/utils/storage';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, ScrollView, View } from 'react-native';

type TimeTarget = 'daily' | 'monthly';
type RhythmTarget = 'revisit' | 'study';

type Sheet = { kind: 'lead' } | { kind: 'rhythm'; target: RhythmTarget } | { kind: 'title' } | null;

const EXACT_ALARM_HINT =
  'Sem esta permissão o Android pode atrasar os lembretes alguns minutos ou mais. Ativa em Alarmes e lembretes.';

const RHYTHM_HINT =
  'Quando alguém passa deste intervalo sem visita, aparece nos alertas do Hoje. Cada estudante pode ter o seu próprio ritmo.';

function timeDate(hour: number, minute: number): Date {
  return new Date(2020, 0, 1, hour, minute, 0, 0);
}

export default function NotificationsScreen() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [titleDraft, setTitleDraft] = useState(prefs.monthly.title);
  const [timePicker, setTimePicker] = useState<{ target: TimeTarget; date: Date } | null>(null);
  const [exactAlarm, setExactAlarm] = useState<PermissionStatus>('granted');

  // Relê ao voltar de "Alarmes e lembretes"; o NotificationProvider volta a agendar.
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

  function onTimePicked(event: DateTimePickerEvent, date?: Date) {
    const target = timePicker?.target;
    setTimePicker(null);
    if (event.type !== 'set' || !date || !target) return;
    commitTime(target, date);
  }

  function saveLead(minutes: LeadMinutes) {
    persist({ ...getNotificationPreferences(), visitLeadMinutes: minutes });
    setSheet(null);
  }

  function saveRhythm(days: RhythmDays) {
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
    sheet?.kind === 'rhythm'
      ? sheet.target === 'revisit'
        ? prefs.rhythm.revisitDays
        : prefs.rhythm.studyDays
      : null;

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
          onChange={onTimePicked}
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

      <BottomSheet
        open={sheet?.kind === 'rhythm'}
        onClose={() => setSheet(null)}
        title={sheet?.kind === 'rhythm' && sheet.target === 'study' ? 'Estudos' : 'Revisitas'}>
        {RHYTHM_DAYS.map((days) => (
          <ChoiceRow
            key={days}
            label={formatRhythm(days)}
            selected={rhythmDays === days}
            onPress={() => saveRhythm(days)}
          />
        ))}
      </BottomSheet>

      <BottomSheet open={sheet?.kind === 'title'} onClose={() => setSheet(null)} title="Título">
        <TextField label="Título da notificação" value={titleDraft} onChangeText={setTitleDraft} />
        <Button onPress={saveTitle}>
          <Text>Guardar</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}

function ChoiceRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="min-h-[52px] flex-row items-center gap-3 active:opacity-70">
      <Text variant="titleS" className="flex-1">
        {label}
      </Text>
      {selected ? <AppIcon name="check" size={18} className="text-primary" /> : null}
    </Pressable>
  );
}
