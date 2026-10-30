import { EntryList } from '@/components/hours/entry-list';
import { GoalProgress } from '@/components/hours/goal-progress';
import { ManualEntrySheet } from '@/components/hours/manual-entry-sheet';
import { PlanSheet } from '@/components/hours/plan-sheet';
import { PlanSummaryCard } from '@/components/hours/plan-summary-card';
import { TimerCard } from '@/components/hours/timer-card';
import { UpcomingDaysList } from '@/components/hours/upcoming-days-list';
import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { monthPlansActions, timeEntriesActions, usersActions } from '@/database/actions';
import { formatDuration, formatMonthName } from '@/utils/hours/format';
import { daysLeftInMonth, remainingMinutes } from '@/utils/hours/plan';
import { isPioneer, monthHourGoal } from '@/utils/hours/profile';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const UPCOMING_LIMIT = 5;

export default function HoursScreen() {
  const today = dayjs();
  const year = today.year();
  const month = today.month() + 1;
  const todayKey = today.format('YYYY-MM-DD');
  const monthName = formatMonthName(year, month);

  const [manualOpen, setManualOpen] = React.useState(false);
  const [planOpen, setPlanOpen] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const { data: stats = { minutes: 0, daysOut: 0 } } = useQuery({
    queryKey: ['time-entries', 'month', year, month],
    queryFn: () => timeEntriesActions.getMonthStats(year, month),
  });
  const { data: week = [] } = useQuery({
    queryKey: ['time-entries', 'week', todayKey],
    queryFn: () => timeEntriesActions.getThisWeek(),
  });
  const { data: plan = null } = useQuery({
    queryKey: ['month-plans', year, month],
    queryFn: () => monthPlansActions.getForMonth(year, month),
  });

  const pioneer = user ? isPioneer(user.publisherType) : false;
  const goal = monthHourGoal(user, plan);
  const daysLeft = daysLeftInMonth(today);
  const remaining = goal ? remainingMinutes(goal, stats.minutes) : 0;
  const futureDays = (plan?.days ?? []).filter((day) => day.day >= todayKey);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Horas" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        {pioneer && goal ? (
          <GoalProgress
            doneMinutes={stats.minutes}
            goalHours={goal}
            monthName={monthName}
            daysLeft={daysLeft}
          />
        ) : (
          <Text variant="bodyS" className="px-1 text-muted-foreground">
            Como publicador não relatas horas. O cronómetro é opcional e serve só para ti.
          </Text>
        )}

        <TimerCard onManual={() => setManualOpen(true)} />

        <Button
          variant="ghost"
          className="flex-row gap-2 border border-border bg-card"
          onPress={() => setManualOpen(true)}>
          <AppIcon name="plus" size={18} className="text-primary" />
          <Text>Adicionar horas à mão</Text>
        </Button>

        {pioneer && goal ? (
          <>
            <PlanSummaryCard
              hasPlan={plan !== null}
              plannedDaysLeft={futureDays.length}
              remaining={remaining}
              daysLeft={daysLeft}
              onEdit={() => setPlanOpen(true)}
            />
            <UpcomingDaysList days={futureDays.slice(0, UPCOMING_LIMIT)} />
          </>
        ) : (
          <SettingsSection title={`${monthName}, só para ti`}>
            <SettingsRow first title="Tempo no ministério" value={formatDuration(stats.minutes)} />
            <SettingsRow title="Dias em que saíste" value={String(stats.daysOut)} />
          </SettingsSection>
        )}

        <EntryList entries={week} />

        <Button variant="ghost" className="self-center" onPress={() => router.push('/report')}>
          <Text>Relatório do mês</Text>
        </Button>
      </ScrollView>

      <ManualEntrySheet open={manualOpen} onClose={() => setManualOpen(false)} />
      {user && goal ? (
        <PlanSheet
          open={planOpen}
          onClose={() => setPlanOpen(false)}
          year={year}
          month={month}
          publisherType={user.publisherType}
          hourGoal={goal}
          remaining={remaining}
          plan={plan}
        />
      ) : null}
    </View>
  );
}
