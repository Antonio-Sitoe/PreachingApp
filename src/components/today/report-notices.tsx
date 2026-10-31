import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { monthKey, monthlyReportsActions } from '@/database/actions';
import { formatMonthName } from '@/utils/hours/format';
import { daysLeftInMonth } from '@/utils/hours/plan';
import { MONTH_END_DAYS } from '@/utils/notifications/month-end';
import { dismissReportNotice, isReportNoticeDismissed } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export function ReportNotices() {
  const now = dayjs();
  const previous = now.subtract(1, 'month');
  const [prevYear, prevMonth] = [previous.year(), previous.month() + 1];
  const [year, month] = [now.year(), now.month() + 1];
  const daysLeft = daysLeftInMonth(now);
  const pendingKey = `pending:${monthKey(prevYear, prevMonth)}`;
  const monthEndKey = `month-end:${monthKey(year, month)}`;
  const [, rerender] = React.useReducer((value: number) => value + 1, 0);

  const { data: last } = useQuery({
    queryKey: ['monthly-reports', prevYear, prevMonth],
    queryFn: () => monthlyReportsActions.getMonth(prevYear, prevMonth),
  });
  const { data: current } = useQuery({
    queryKey: ['monthly-reports', year, month],
    queryFn: () => monthlyReportsActions.getMonth(year, month),
    enabled: daysLeft <= MONTH_END_DAYS,
  });

  const dismiss = (key: string) => {
    dismissReportNotice(key);
    rerender();
  };

  const showPending =
    last && !last.sentAt && last.participated && !isReportNoticeDismissed(pendingKey);
  const showMonthEnd =
    daysLeft <= MONTH_END_DAYS &&
    current &&
    !current.participated &&
    !isReportNoticeDismissed(monthEndKey);

  if (!showPending && !showMonthEnd) return null;

  return (
    <View className="gap-3">
      {showPending ? (
        <Notice
          title={`O relatório de ${formatMonthName(prevYear, prevMonth)} está por enviar`}
          body={`Já está preenchido: ${last.bibleStudies} ${last.bibleStudies === 1 ? 'estudo' : 'estudos'}. Falta só partilhar.`}
          action="Abrir relatório"
          onAction={() =>
            router.push({
              pathname: '/report',
              params: { year: String(prevYear), month: String(prevMonth) },
            })
          }
          onDismiss={() => dismiss(pendingKey)}
        />
      ) : null}
      {showMonthEnd ? (
        <Notice
          title={`${formatMonthName(year, month)} acaba ${daysLeft === 1 ? 'hoje' : `daqui a ${daysLeft} dias`}`}
          body="Ainda não há nenhuma visita registada este mês."
          action="Registar visita"
          onAction={() => router.push('/visit/new')}
          onDismiss={() => dismiss(monthEndKey)}
        />
      ) : null}
    </View>
  );
}

type NoticeProps = {
  title: string;
  body: string;
  action: string;
  onAction: () => void;
  onDismiss: () => void;
};

function Notice({ title, body, action, onAction, onDismiss }: NoticeProps) {
  return (
    <View role="status" className="gap-3 rounded-lg bg-warning-soft px-4 py-3.5">
      <View className="flex-row items-start gap-3">
        <AppIcon name="alert" size={20} className="mt-px text-warning" />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="font-display-semibold text-[15px] leading-5 text-warning">{title}</Text>
          <Text variant="bodyS" className="text-foreground">
            {body}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Button size="sm" variant="ghost" className="bg-card px-4" onPress={onAction}>
          <Text className="text-foreground">{action}</Text>
        </Button>
        <Button size="sm" variant="ghost" onPress={onDismiss}>
          <Text className="font-display-medium text-muted-foreground">Agora não</Text>
        </Button>
      </View>
    </View>
  );
}
