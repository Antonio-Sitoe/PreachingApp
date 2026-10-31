import { ReportStatusBadge } from '@/components/reports/status-badge';
import { StudiesCounter } from '@/components/reports/studies-counter';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { monthlyReportsActions, monthPlansActions, usersActions } from '@/database/actions';
import { formatHero, formatHours, formatMonthName } from '@/utils/hours/format';
import { isPioneer, monthHourGoal } from '@/utils/hours/profile';
import { syncAllNotifications } from '@/utils/notifications/scheduler';
import { PUBLISHER_TYPE_INFO } from '@/utils/profile/setup';
import {
  formatReportMonth,
  formatStudyNames,
  isCurrentMonth,
  reportHours,
  reportShareText,
  reportStatus,
} from '@/utils/reports';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, Share, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PARTICIPATED_OPTIONS = [
  { value: 1, label: 'Sim' },
  { value: 0, label: 'Não' },
] as const;

function initialMonth(year?: string, month?: string) {
  const current = dayjs().startOf('month');
  if (!year || !month) return current;
  const picked = dayjs(new Date(Number(year), Number(month) - 1, 1));
  return picked.isValid() && !picked.isAfter(current) ? picked : current;
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ year?: string; month?: string }>();
  const [cursor, setCursor] = React.useState(() => initialMonth(params.year, params.month));
  const [busy, setBusy] = React.useState(false);
  const year = cursor.year();
  const month = cursor.month() + 1;
  const current = isCurrentMonth({ year, month });

  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const { data: report } = useQuery({
    queryKey: ['monthly-reports', year, month],
    queryFn: () => monthlyReportsActions.getMonth(year, month),
  });
  const pioneer = user ? isPioneer(user.publisherType) : false;
  const { data: plan = null } = useQuery({
    queryKey: ['month-plans', year, month],
    queryFn: () => monthPlansActions.getForMonth(year, month),
    enabled: pioneer,
  });

  const goal = monthHourGoal(user, plan);
  const monthName = formatMonthName(year, month);
  const status = report ? reportStatus(report) : 'pending';
  const sent = status === 'sent';
  const text =
    report && user
      ? reportShareText({
          name: user.name,
          typeLabel: PUBLISHER_TYPE_INFO[user.publisherType].label,
          pioneer,
          report,
        })
      : '';

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['monthly-reports'] });

  const change = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await refresh();
    } catch {
      showToast({ message: 'Não foi possível guardar. Tenta de novo.' });
    }
  };

  const markSent = async () => {
    if (!report || !user) return;
    await monthlyReportsActions.markSent(year, month, {
      publisherType: user.publisherType,
      participated: report.participated,
      bibleStudies: report.bibleStudies,
      hours: reportHours(report.minutes),
    });
    await refresh();
    void syncAllNotifications();
    showToast({
      message: 'Relatório marcado como enviado',
      action: {
        label: 'Desfazer',
        icon: 'undo',
        onPress: () => void change(() => monthlyReportsActions.unmarkSent(year, month)),
      },
    });
  };

  const share = async () => {
    setBusy(true);
    try {
      const result = await Share.share({ message: text });
      if (result.action === Share.sharedAction) await markSent();
    } catch {
      showToast({ message: 'Não foi possível abrir a partilha.' });
    } finally {
      setBusy(false);
    }
  };

  const percent =
    goal && report ? Math.min(100, Math.round((report.minutes / (goal * 60)) * 100)) : 0;
  const studiesHint = report
    ? (formatStudyNames(report.studyNames, monthName) ??
      (pioneer ? 'A partir das visitas com estudo' : 'Ainda sem visitas com estudo este mês'))
    : null;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Relatório" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-4 self-center px-4 pb-6 pt-5">
        <View className="flex-row items-center gap-2">
          <MonthArrow
            icon="chevron-left"
            label="Mês anterior"
            onPress={() => setCursor((value) => value.subtract(1, 'month'))}
          />
          <View className="flex-1 items-center gap-1">
            <Text variant="titleL">{formatReportMonth(year, month)}</Text>
            {report ? <ReportStatusBadge status={status} className="self-center" /> : null}
          </View>
          <MonthArrow
            icon="chevron-right"
            label="Mês seguinte"
            disabled={current}
            onPress={() => setCursor((value) => value.add(1, 'month'))}
          />
        </View>

        {report ? (
          <View className="gap-3 rounded-lg border border-border bg-card p-4">
            {pioneer ? (
              <View className="gap-2.5">
                <View className="flex-row flex-wrap items-baseline gap-x-2">
                  <Text className="font-display text-[45px] leading-[48px] text-primary-strong">
                    {formatHero(report.minutes)}
                  </Text>
                  {goal ? (
                    <Text variant="titleS" className="text-muted-foreground">
                      de {formatHours(goal * 60)}
                    </Text>
                  ) : null}
                  {current ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onPress={() => router.push('/hours')}>
                      <Text>Corrigir</Text>
                    </Button>
                  ) : null}
                </View>
                {goal ? (
                  <View
                    role="progressbar"
                    aria-label={`${percent}% da meta do mês`}
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2 overflow-hidden rounded-full bg-muted">
                    <View
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <View className="gap-2">
                <Text variant="titleS">Participei no ministério este mês</Text>
                <SegmentedControl
                  accessibilityLabel="Participei no ministério este mês"
                  options={PARTICIPATED_OPTIONS}
                  value={report.participated ? 1 : 0}
                  onChange={(value) =>
                    void change(() =>
                      monthlyReportsActions.setParticipated(
                        year,
                        month,
                        (value === 1) === report.participatedAuto ? null : value === 1
                      )
                    )
                  }
                />
              </View>
            )}
            <View className="h-px bg-border" />
            <StudiesCounter
              value={report.bibleStudies}
              hint={studiesHint}
              onChange={(value) =>
                void change(() =>
                  monthlyReportsActions.setBibleStudies(
                    year,
                    month,
                    value === report.studiesAuto ? null : value
                  )
                )
              }
            />
          </View>
        ) : null}

        {!pioneer ? (
          <Text variant="bodyS" className="px-1 text-muted-foreground">
            O relatório é preenchido a partir das visitas que registaste. Podes corrigir antes de
            enviar.
          </Text>
        ) : null}

        {text ? (
          <View className="gap-2">
            <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
              Texto a partilhar
            </Text>
            <Text className="rounded-lg bg-muted px-4 py-3.5">{text}</Text>
          </View>
        ) : null}

        {!pioneer && current ? (
          <Button variant="ghost" className="self-center" onPress={() => router.push('/hours')}>
            <Text>Horas e cronómetro</Text>
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className="flex-row gap-1.5 self-center"
          onPress={() => router.push('/reports')}>
          <Text>Ver meses anteriores</Text>
          <AppIcon name="chevron-right" size={16} className="text-primary" />
        </Button>
      </ScrollView>

      <View
        className="w-full max-w-[640px] gap-2 self-center px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
        <Button className="flex-row gap-2" disabled={!report || busy} onPress={() => void share()}>
          <AppIcon name="share" size={18} className="text-primary-foreground" />
          <Text>{sent ? 'Partilhar de novo' : 'Partilhar'}</Text>
        </Button>
        {sent ? (
          <Button
            variant="ghost"
            className="min-h-12"
            onPress={() => void change(() => monthlyReportsActions.unmarkSent(year, month))}>
            <Text>Marcar como por enviar</Text>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="min-h-12"
            disabled={!report}
            onPress={() => void markSent()}>
            <Text>Marcar como enviado sem partilhar</Text>
          </Button>
        )}
      </View>
    </View>
  );
}

type MonthArrowProps = {
  icon: 'chevron-left' | 'chevron-right';
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function MonthArrow({ icon, label, disabled, onPress }: MonthArrowProps) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className="size-11 items-center justify-center rounded-lg border border-border bg-card active:bg-secondary disabled:opacity-30">
      <AppIcon name={icon} size={20} className="text-foreground" />
    </Pressable>
  );
}
