import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { monthHeading, reportDateLabel } from '@/components/reports/format';
import { useReportForm } from '@/components/reports/store';
import { reportsActions, type ReportMonthGroup, type ReportYearGroup } from '@/database/actions';
import type { Report } from '@/database/schemas';
import { isReportListGrouped, setReportListGrouped } from '@/lib/storage';
import { minutesToHoursAndMinutes } from '@/utils/dates';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SquarePen } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { THEME } from '@/lib/theme';

function hoursLabel(hours: number, minutes: number, students: number) {
  return `${minutesToHoursAndMinutes(hours, minutes)} horas, ${students} estudos`;
}

function ReportLine({ report, onPress }: { report: Report; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="mt-3 active:opacity-70">
      <Text variant="labelS" className="self-start rounded-md bg-primary px-2 py-1 text-primary-foreground">
        {reportDateLabel(report.date)}
      </Text>
      <Text variant="bodyS" className="mt-1 pl-1 text-muted-foreground">
        {hoursLabel(report.hours, report.minutes, report.students)}
      </Text>
    </Pressable>
  );
}

function GroupedList() {
  const openEdit = useReportForm((state) => state.openEdit);
  const { data = [], isLoading } = useQuery({
    queryKey: ['reports', 'grouped'],
    queryFn: () => reportsActions.getGrouped(),
  });

  if (isLoading) return <ActivityIndicator className="mt-10" />;
  if (data.length === 0) {
    return (
      <View className="px-4 py-8">
        <EmptyState
          icon="clock"
          title="Ainda não há horas"
          description="Regista o primeiro dia com o botão +."
        />
      </View>
    );
  }

  return (
    <FlashList
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(item) => String(item.year)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 112 }}
      renderItem={({ item }) => <YearBlock year={item} onEdit={openEdit} />}
    />
  );
}

function YearBlock({ year, onEdit }: { year: ReportYearGroup; onEdit: (report: Report) => void }) {
  return (
    <View className="gap-3 pb-2">
      {year.months.map((month) => (
        <MonthBlock key={month.month} year={year.year} month={month} onEdit={onEdit} />
      ))}
    </View>
  );
}

function MonthBlock({
  year,
  month,
  onEdit,
}: {
  year: number;
  month: ReportMonthGroup;
  onEdit: (report: Report) => void;
}) {
  const totals = month.reports.reduce(
    (sum, report) => ({
      hours: sum.hours + report.hours,
      minutes: sum.minutes + report.minutes,
      students: sum.students + report.students,
    }),
    { hours: 0, minutes: 0, students: 0 }
  );

  return (
    <View className="rounded-lg bg-secondary p-4">
      <Text variant="titleS">{monthHeading(month.month, year)}</Text>
      <Text variant="bodyS" className="mt-1 text-muted-foreground">
        {hoursLabel(totals.hours, totals.minutes, totals.students)}
      </Text>
      {month.reports.map((report) => (
        <ReportLine key={report.id} report={report} onPress={() => onEdit(report)} />
      ))}
    </View>
  );
}

function PagedList() {
  const openEdit = useReportForm((state) => state.openEdit);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['reports', 'page'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => reportsActions.getPage(pageParam, 10),
    getNextPageParam: (lastPage, pages) => {
      const next = pages.length;
      return next < lastPage.totalPage ? next : undefined;
    },
  });
  const reports = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) return <ActivityIndicator className="mt-10" />;
  if (reports.length === 0) {
    return (
      <View className="px-4 py-8">
        <EmptyState
          icon="clock"
          title="Ainda não há horas"
          description="Regista o primeiro dia com o botão +."
        />
      </View>
    );
  }

  return (
    <FlashList
      style={{ flex: 1 }}
      data={reports}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 112 }}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <View className="mb-3 flex-row gap-2">
          <View className="flex-1 rounded-lg bg-card p-3">
            <Text variant="labelS" className="self-start rounded-md bg-primary px-2 py-1 text-primary-foreground">
              {reportDateLabel(item.date)}
            </Text>
            <Text variant="bodyS" className="mt-2 text-muted-foreground">
              {hoursLabel(item.hours, item.minutes, item.students)}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar relatório"
            onPress={() => openEdit(item)}
            className="w-14 items-center justify-center rounded-lg bg-primary active:opacity-80">
            <SquarePen size={20} color={theme.primaryForeground} />
          </Pressable>
        </View>
      )}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={theme.primary} className="my-4" />
        ) : hasNextPage ? (
          <Pressable onPress={() => fetchNextPage()} className="my-4 items-center">
            <Text variant="labelM" className="text-primary">
              Ver mais
            </Text>
          </Pressable>
        ) : (
          <Text variant="bodyS" className="my-4 text-center text-subtle">
            Não há mais relatórios.
          </Text>
        )
      }
    />
  );
}

function ReportsList() {
  const [grouped, setGrouped] = useState(isReportListGrouped);

  function toggle() {
    const next = !grouped;
    setGrouped(next);
    setReportListGrouped(next);
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-end px-4 pb-2">
        <IconButton
          variant="ghost"
          icon={grouped ? 'notes' : 'calendar'}
          accessibilityLabel={grouped ? 'Ver um a um' : 'Ver por mês'}
          onPress={toggle}
        />
      </View>
      {grouped ? <GroupedList /> : <PagedList />}
    </View>
  );
}

export { ReportsList };
