import { GoalProgress } from '@/components/hours/goal-progress';
import { ManualEntrySheet } from '@/components/hours/manual-entry-sheet';
import { QuickStudentSheet } from '@/components/students/quick-student-sheet';
import { type QuickAction, QuickActionsSheet } from '@/components/today/quick-actions-sheet';
import { SectionTitle, TodayCard } from '@/components/today/today-card';
import { VisitActionsSheet } from '@/components/today/visit-actions-sheet';
import { WeekStrip } from '@/components/today/week-strip';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import {
  defaultRemind,
  NextVisitSheet,
  type NextVisitValue,
} from '@/components/visits/next-visit-sheet';
import { NotHomeSheet } from '@/components/visits/not-home-sheet';
import {
  appointmentsActions,
  monthPlansActions,
  type OutOfRhythmItem,
  timeEntriesActions,
  type TodayItem,
  todayActions,
  usersActions,
  visitsActions,
} from '@/database/actions';
import type { Visit } from '@/database/schemas';
import { formatMonthName } from '@/utils/hours/format';
import { daysLeftInMonth } from '@/utils/hours/plan';
import { isPioneer, monthHourGoal } from '@/utils/hours/profile';
import { formatRhythm } from '@/utils/students/detail';
import { formatShortDay, daysAhead } from '@/utils/students/return-date';
import {
  formatAppointmentTime,
  formatDaysAgo,
  formatDoneLine,
  formatPrepLine,
  formatTodayHeader,
} from '@/utils/today/format';
import { refreshVisitData } from '@/utils/visits/refresh';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodayScreen() {
  const queryClient = useQueryClient();
  const now = dayjs();
  const year = now.year();
  const month = now.month() + 1;

  const todayQuery = useQuery({
    queryKey: ['appointments', 'today', now.format('YYYY-MM-DD')],
    queryFn: () => todayActions.getToday(),
  });
  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const pioneer = user ? isPioneer(user.publisherType) : false;
  const { data: stats } = useQuery({
    queryKey: ['time-entries', 'month', year, month],
    queryFn: () => timeEntriesActions.getMonthStats(year, month),
    enabled: pioneer,
  });
  const { data: plan = null } = useQuery({
    queryKey: ['month-plans', year, month],
    queryFn: () => monthPlansActions.getForMonth(year, month),
    enabled: pioneer,
  });

  const [actionsFor, setActionsFor] = React.useState<TodayItem | null>(null);
  const [notHome, setNotHome] = React.useState<{ visit: Visit; name: string } | null>(null);
  const [scheduling, setScheduling] = React.useState<OutOfRhythmItem | null>(null);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const [addingHours, setAddingHours] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const data = todayQuery.data;
  const goal = monthHourGoal(user, plan);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await todayQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  function visitDone(item: TodayItem) {
    setActionsFor(null);
    router.push(`/visit/new?studentId=${item.student.id}`);
  }

  async function notAtHome(item: TodayItem) {
    setActionsFor(null);
    try {
      const visit = await visitsActions.create({
        studentId: item.student.id,
        visitedAt: new Date(),
        outcome: 'not_home',
      });
      await refreshVisitData(queryClient);
      setNotHome({ visit, name: item.student.displayName });
    } catch {
      showToast({ message: 'Não foi possível guardar a tentativa. Tenta outra vez.' });
    }
  }

  async function postpone(item: TodayItem, date: Date) {
    setActionsFor(null);
    try {
      const previous = await appointmentsActions.reschedule(item.appointment.id, date);
      await refreshVisitData(queryClient);
      showToast({
        message: `Visita adiada para ${formatShortDay(date)}.`,
        action: previous
          ? {
              label: 'Desfazer',
              icon: 'undo',
              onPress: async () => {
                await appointmentsActions.reschedule(item.appointment.id, new Date(previous));
                await refreshVisitData(queryClient);
              },
            }
          : undefined,
      });
    } catch {
      showToast({ message: 'Não foi possível adiar. Tenta outra vez.' });
    }
  }

  async function schedule(item: OutOfRhythmItem, value: NextVisitValue) {
    setScheduling(null);
    try {
      await appointmentsActions.schedule(item.student.id, {
        date: value.date,
        time: value.time,
        remindMinutesBefore: value.remindMinutes,
      });
      await refreshVisitData(queryClient);
      showToast({ message: `Visita marcada para ${formatShortDay(value.date)}.` });
    } catch {
      showToast({ message: 'Não foi possível marcar a visita. Tenta outra vez.' });
    }
  }

  function quickAction(action: QuickAction) {
    setQuickOpen(false);
    if (action === 'visit') router.push('/visit/new');
    if (action === 'study') router.push('/visit/new?study=1');
    if (action === 'contact') setCapturing(true);
    if (action === 'hours') router.push('/hours');
  }

  const today = data?.today ?? [];
  const done = data?.doneToday ?? [];
  const overdue = data?.overdue ?? [];
  const outOfRhythm = data?.outOfRhythm ?? [];
  const tomorrow = data?.tomorrow ?? [];
  const nothingToday = today.length === 0 && overdue.length === 0;
  const dayFinished = nothingToday && done.length > 0;
  const empty = nothingToday && done.length === 0 && outOfRhythm.length === 0;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }} className="bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full grow self-center gap-6 px-4 pb-28 pt-4"
        contentContainerStyle={{ maxWidth: CONTENT_MAX_WIDTH }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 gap-0.5">
            <Text variant="labelS" className="text-muted-foreground">
              {formatTodayHeader()}
            </Text>
            <Text variant="titleXl">Hoje</Text>
          </View>
          <IconButton
            icon="bell"
            variant="ghost"
            accessibilityLabel="Notificações"
            onPress={() => router.push('/notifications')}
          />
        </View>

        <WeekStrip markedDays={data?.weekDays ?? []} />

        {todayQuery.isLoading ? null : empty ? (
          <View className="grow items-center justify-center gap-4 px-6">
            <View className="size-[72px] items-center justify-center rounded-full bg-secondary">
              <AppIcon name="calendar" size={32} className="text-primary" />
            </View>
            <View className="gap-2">
              <Text variant="titleM" className="text-center">
                Nada marcado para hoje
              </Text>
              <Text className="text-center text-muted-foreground">
                Quando agendares uma visita, ela aparece aqui. Se conheceres alguém no terreno,
                regista logo para não perder o contacto.
              </Text>
            </View>
            <Button className="self-stretch" onPress={() => setCapturing(true)}>
              <Text>Novo contacto</Text>
            </Button>
            <Button variant="ghost" className="min-h-11" onPress={() => router.push('/students')}>
              <Text>Ver estudantes</Text>
            </Button>
          </View>
        ) : (
          <>
            <View className="flex-row gap-3">
              <SummaryCard
                value={data?.studiesThisMonth ?? 0}
                unit="este mês"
                label="Estudos bíblicos"
                onPress={() => router.push('/report')}
              />
              <SummaryCard
                value={data?.activeStudents ?? 0}
                unit="a acompanhar"
                label="Estudantes"
                onPress={() => router.push('/students')}
              />
            </View>

            {pioneer && goal ? (
              <View className="gap-3">
                <GoalProgress
                  doneMinutes={stats?.minutes ?? 0}
                  goalHours={goal}
                  monthName={formatMonthName(year, month)}
                  daysLeft={daysLeftInMonth(now)}
                />
                <View className="flex-row gap-2">
                  <Button className="flex-1" onPress={() => router.push('/hours')}>
                    <AppIcon name="play" size={18} className="text-primary-foreground" />
                    <Text>Iniciar cronómetro</Text>
                  </Button>
                  <Button variant="outline" onPress={() => setAddingHours(true)}>
                    <Text>Adicionar</Text>
                  </Button>
                </View>
              </View>
            ) : null}

            {dayFinished ? (
              <View className="flex-row items-center gap-4 rounded-lg bg-success-soft px-4 py-5">
                <View className="size-12 items-center justify-center rounded-full bg-success">
                  <AppIcon name="check" size={24} strokeWidth={2.5} className="text-white" />
                </View>
                <View className="min-w-0 flex-1 gap-1">
                  <Text variant="titleM">Dia concluído</Text>
                  <Text className="text-muted-foreground">
                    {done.length === 1 ? '1 visita registada' : `${done.length} visitas registadas`}
                    . Ninguém ficou por visitar hoje.
                  </Text>
                </View>
              </View>
            ) : null}

            {overdue.length > 0 ? (
              <View className="gap-3">
                <SectionTitle title="Em atraso" badge={String(overdue.length)} tone="warning" />
                {overdue.map((item) => (
                  <TodayCard
                    key={item.appointment.id}
                    student={item.student}
                    when={formatDaysAgo(item.daysLate)}
                    whenTone="warning"
                    detail={formatPrepLine(item.student, item.lastMet)}
                    actionLabel={`Marcar a visita a ${item.student.displayName} como feita ou adiar`}
                    onAction={() => setActionsFor(item)}
                  />
                ))}
              </View>
            ) : null}

            {today.length > 0 || (done.length > 0 && !dayFinished) ? (
              <View className="gap-3">
                <SectionTitle
                  title="Visitas de hoje"
                  badge={
                    done.length > 0
                      ? `${done.length} de ${done.length + today.length} feitas`
                      : String(today.length)
                  }
                />
                {done.map((item) => (
                  <TodayCard
                    key={item.visit.id}
                    student={item.student}
                    when={dayjs(item.visit.visitedAt).format('HH:mm')}
                    detail={formatDoneLine(item.visit, item.next)}
                    done
                  />
                ))}
                {today.map((item) => (
                  <TodayCard
                    key={item.appointment.id}
                    student={item.student}
                    when={formatAppointmentTime(item.appointment)}
                    detail={formatPrepLine(item.student, item.lastMet)}
                    actionLabel={`Marcar a visita a ${item.student.displayName} como feita ou adiar`}
                    onAction={() => setActionsFor(item)}
                  />
                ))}
              </View>
            ) : null}

            {dayFinished ? (
              <View className="gap-3">
                <SectionTitle title="Feitas hoje" />
                {done.map((item) => (
                  <TodayCard
                    key={item.visit.id}
                    student={item.student}
                    detail={formatDoneLine(item.visit, item.next)}
                    done
                  />
                ))}
              </View>
            ) : null}

            {outOfRhythm.length > 0 ? (
              <View className="gap-3">
                <SectionTitle title="A sair do ritmo" badge={String(outOfRhythm.length)} />
                {outOfRhythm.map((item) => (
                  <View
                    key={item.student.id}
                    className="flex-row items-center gap-3 rounded-lg bg-card py-3.5 pl-4 pr-3">
                    <Pressable
                      role="button"
                      onPress={() => router.push(`/student/${item.student.id}`)}
                      className="min-w-0 flex-1 gap-1 active:opacity-70">
                      <Text variant="titleS" numberOfLines={2}>
                        {item.student.displayName}
                      </Text>
                      <Text variant="bodyS" className="text-muted-foreground">
                        {formatRhythm(item.student.rhythmDays)} ·{' '}
                        {item.lastMet
                          ? `última visita ${formatDaysAgo(item.daysSince)}`
                          : `registado ${formatDaysAgo(item.daysSince)}`}
                      </Text>
                    </Pressable>
                    <Button variant="outline" size="sm" onPress={() => setScheduling(item)}>
                      <Text>Agendar</Text>
                    </Button>
                  </View>
                ))}
              </View>
            ) : null}

            {dayFinished && tomorrow.length > 0 ? (
              <View className="gap-3">
                <SectionTitle title="Amanhã" />
                <View className="flex-row items-center gap-3 rounded-lg bg-card px-4 py-3.5">
                  <View className="size-10 items-center justify-center rounded-full bg-secondary">
                    <AppIcon name="calendar" size={20} className="text-primary" />
                  </View>
                  <View className="min-w-0 flex-1 gap-0.5">
                    <Text variant="titleS">
                      {tomorrow.length === 1
                        ? '1 visita marcada'
                        : `${tomorrow.length} visitas marcadas`}
                    </Text>
                    <Text variant="bodyS" className="text-muted-foreground">
                      {tomorrow[0].appointment.time
                        ? `A primeira às ${tomorrow[0].appointment.time}, com ${tomorrow[0].student.displayName}`
                        : `Com ${tomorrow[0].student.displayName}`}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
        <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
          <Fab floating accessibilityLabel="Registar" onPress={() => setQuickOpen(true)} />
        </View>
      </View>

      <VisitActionsSheet
        item={actionsFor}
        onDone={visitDone}
        onNotHome={notAtHome}
        onPostpone={postpone}
        onClose={() => setActionsFor(null)}
      />
      <NotHomeSheet
        visit={notHome?.visit ?? null}
        studentName={notHome?.name ?? ''}
        onUndo={() => setNotHome(null)}
        onDone={() => setNotHome(null)}
      />
      {scheduling ? (
        <NextVisitSheet
          open
          subtitle={`${scheduling.student.displayName} · ${formatRhythm(scheduling.student.rhythmDays).toLocaleLowerCase('pt')}`}
          rhythmDays={scheduling.student.rhythmDays}
          value={{
            date: daysAhead(1),
            time: null,
            remindMinutes: defaultRemind(),
          }}
          onConfirm={(value) => schedule(scheduling, value)}
          onClose={() => setScheduling(null)}
        />
      ) : null}
      <QuickActionsSheet
        open={quickOpen}
        onSelect={quickAction}
        onClose={() => setQuickOpen(false)}
      />
      <QuickStudentSheet open={capturing} onClose={() => setCapturing(false)} />
      <ManualEntrySheet open={addingHours} onClose={() => setAddingHours(false)} />
    </SafeAreaView>
  );
}

type SummaryCardProps = {
  value: number;
  unit: string;
  label: string;
  onPress: () => void;
};

function SummaryCard({ value, unit, label, onPress }: SummaryCardProps) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className="min-w-0 flex-1 gap-0.5 rounded-lg bg-secondary px-4 py-3.5 active:opacity-80">
      <View className="flex-row flex-wrap items-baseline gap-1">
        <Text className="font-display text-[25px] leading-8 text-primary-strong">{value}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {unit}
        </Text>
      </View>
      <Text variant="labelS" className="text-[13px] text-muted-foreground">
        {label}
      </Text>
    </Pressable>
  );
}
