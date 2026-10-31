import { ReportStatusBadge } from '@/components/reports/status-badge';
import { AppIcon } from '@/components/ui/app-icon';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { LIST_VIEW_OPTIONS } from '@/constants/settings';
import { type MonthReport, monthlyReportsActions, usersActions } from '@/database/actions';
import { isPioneer } from '@/utils/hours/profile';
import {
  formatReportDetail,
  formatReportMonth,
  isCurrentMonth,
  reportHours,
  reportStatus,
} from '@/utils/reports';
import { getListView, type ListView, setListView } from '@/utils/storage';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const open = (report: MonthReport) =>
  router.push({
    pathname: '/report',
    params: { year: String(report.year), month: String(report.month) },
  });

export default function ReportsScreen() {
  const [view, setView] = React.useState<ListView>(getListView);
  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const { data: history } = useQuery({
    queryKey: ['monthly-reports', 'history'],
    queryFn: () => monthlyReportsActions.getHistory(),
  });
  const pioneer = user ? isPioneer(user.publisherType) : false;

  const changeView = (next: ListView) => {
    setView(next);
    setListView(next);
  };

  const past = (history ?? []).filter((report) => !isCurrentMonth(report));
  const current = (history ?? []).find((report) => isCurrentMonth(report));
  const empty = history !== undefined && past.length === 0 && !current?.participated;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Relatórios" onBack={() => router.back()} />
      {empty ? (
        <View className="w-full max-w-[640px] flex-1 justify-center self-center px-4">
          <EmptyState
            icon="file"
            title="Ainda não há relatórios"
            description="O primeiro aparece no fim deste mês, preenchido a partir das visitas que registares."
            actionLabel="Ver o mês em curso"
            onActionPress={() => router.push('/report')}
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
          <View className="gap-2">
            <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
              Vista
            </Text>
            <SegmentedControl
              accessibilityLabel="Vista"
              options={LIST_VIEW_OPTIONS}
              value={view}
              onChange={changeView}
            />
          </View>

          {view === 'list' ? (
            <>
              {current ? (
                <Row report={current} pioneer={pioneer} highlighted onPress={() => open(current)} />
              ) : null}
              {past.length > 0 ? (
                <View className="overflow-hidden rounded-lg border border-border bg-card">
                  {past.map((report, index) => (
                    <Row
                      key={`${report.year}-${report.month}`}
                      report={report}
                      pioneer={pioneer}
                      first={index === 0}
                      onPress={() => open(report)}
                    />
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {(history ?? []).map((report) => (
                <Card
                  key={`${report.year}-${report.month}`}
                  report={report}
                  pioneer={pioneer}
                  onPress={() => open(report)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

type ItemProps = {
  report: MonthReport;
  pioneer: boolean;
  onPress: () => void;
};

function Row({
  report,
  pioneer,
  onPress,
  first,
  highlighted,
}: ItemProps & { first?: boolean; highlighted?: boolean }) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className={cn(
        'min-h-[60px] flex-row items-center gap-3 py-2.5 pl-4 pr-3 active:bg-secondary',
        highlighted
          ? 'rounded-lg border-[1.5px] border-primary bg-secondary py-3.5'
          : !first && 'border-t border-border'
      )}>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="titleS">{formatReportMonth(report.year, report.month)}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {formatReportDetail(report, pioneer)}
        </Text>
      </View>
      <ReportStatusBadge status={reportStatus(report)} />
      <AppIcon name="chevron-right" size={18} className="text-subtle" />
    </Pressable>
  );
}

function Card({ report, pioneer, onPress }: ItemProps) {
  const value = pioneer ? (report.sentHours ?? reportHours(report.minutes)) : report.bibleStudies;
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className="w-[48.5%] gap-2 rounded-lg border border-border bg-card px-4 py-3.5 active:bg-secondary">
      <Text variant="titleS">{formatReportMonth(report.year, report.month)}</Text>
      <Text className="font-display text-[25px] leading-8 text-primary-strong">{value}</Text>
      <Text variant="bodyS" className="text-muted-foreground">
        {pioneer ? 'horas' : value === 1 ? 'estudo bíblico' : 'estudos bíblicos'}
      </Text>
      <ReportStatusBadge status={reportStatus(report)} />
    </Pressable>
  );
}
