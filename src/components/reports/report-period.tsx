import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { monthHeading, monthShareText } from '@/components/reports/format';
import { PUBLISHER_TYPE_INFO } from '@/utils/profile/setup';
import { reportsActions, usersActions } from '@/database/actions';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ActivityIndicator, Share, View } from 'react-native';

function PeriodHeader({
  label,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
}: {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <View className="flex-row items-center justify-between px-2">
      <IconButton variant="ghost" icon="chevron-left" accessibilityLabel={previousLabel} onPress={onPrevious} />
      <Text variant="titleM" className="capitalize">
        {label}
      </Text>
      <IconButton variant="ghost" icon="chevron-right" accessibilityLabel={nextLabel} onPress={onNext} />
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
      <Text>{label}</Text>
      <Text variant="labelM">{value}</Text>
    </View>
  );
}

function ReportMonth() {
  const [cursor, setCursor] = useState(() => dayjs());
  const month = cursor.month() + 1;
  const year = cursor.year();

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'month', year, month],
    queryFn: () => reportsActions.getGlobalStates(month, year),
  });
  const { data: user } = useQuery({
    queryKey: ['reports', 'user'],
    queryFn: () => usersActions.getCurrent(),
  });

  const profile = user ? PUBLISHER_TYPE_INFO[user.publisherType].label : '—';

  async function share() {
    if (!data) return;
    try {
      await Share.share({
        message: monthShareText({
          name: user?.name || 'publicador',
          month,
          year,
          time: data.time,
          students: data.students,
        }),
      });
    } catch {
      showToast({ message: 'Não foi possível partilhar o relatório.' });
    }
  }

  return (
    <View className="flex-1">
      <PeriodHeader
        label={monthHeading(month, year)}
        previousLabel="Mês anterior"
        nextLabel="Mês seguinte"
        onPrevious={() => setCursor((current) => current.subtract(1, 'month'))}
        onNext={() => setCursor((current) => current.add(1, 'month'))}
      />
      {isLoading || !data ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <>
          <SummaryRow label="Participou no ministério" value={data.isParticipated ? 'Sim' : 'Não'} />
          <SummaryRow label="Horas" value={data.time} />
          <SummaryRow label="Estudos" value={data.students} />
          <SummaryRow label="Perfil" value={profile} />
          <View className="px-4 pt-6">
            <Button variant="outline" onPress={share}>
              <Text>Partilhar</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

function ReportYear() {
  const [year, setYear] = useState(() => dayjs().year());
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'year', year],
    queryFn: () => reportsActions.getByYear(year),
  });

  return (
    <View className="flex-1">
      <PeriodHeader
        label={String(year)}
        previousLabel="Ano anterior"
        nextLabel="Ano seguinte"
        onPrevious={() => setYear((current) => current - 1)}
        onNext={() => setYear((current) => current + 1)}
      />
      {isLoading || !data ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <>
          <SummaryRow label="Horas" value={data.time} />
          <SummaryRow label="Estudos" value={data.students} />
        </>
      )}
    </View>
  );
}

export { ReportMonth, ReportYear };
