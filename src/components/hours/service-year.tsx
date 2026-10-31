import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { Text } from '@/components/ui/text';
import { formatDuration, formatHours, formatMonthName } from '@/utils/hours/format';
import { perDay } from '@/utils/hours/plan';
import {
  monthsLeftInServiceYear,
  serviceYearLabel,
  serviceYearMonths,
} from '@/utils/hours/service-year';
import dayjs from 'dayjs';
import { View } from 'react-native';

type ServiceYearProps = {
  startYear: number;
  goalHours: number;
  minutesByMonth: Map<string, number>;
};

const key = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

function ServiceYearCard({ startYear, goalHours, minutesByMonth }: ServiceYearProps) {
  const done = [...minutesByMonth.values()].reduce((total, minutes) => total + minutes, 0);
  const goalMinutes = goalHours * 60;
  const remaining = Math.max(0, goalMinutes - done);
  const monthsLeft = monthsLeftInServiceYear();
  const percent = Math.min(100, Math.round((done / goalMinutes) * 100));

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row flex-wrap items-baseline justify-between gap-x-2">
        <Text variant="titleS">Ano de serviço {serviceYearLabel(startYear)}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {formatHours(done)} de {formatHours(goalMinutes)}
        </Text>
      </View>
      <View
        role="progressbar"
        aria-label={`${percent}% da meta do ano`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-muted">
        <View className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </View>
      <Text variant="bodyS" className="text-muted-foreground">
        {remaining > 0
          ? `Para chegar às ${formatHours(goalMinutes)}: cerca de ${formatDuration(perDay(remaining, monthsLeft))} por mês ${monthsLeft === 1 ? 'neste último mês' : `nos ${monthsLeft} meses que faltam`}`
          : `Meta do ano de serviço cumprida`}
      </Text>
    </View>
  );
}

function ServiceYearMonths({ startYear, minutesByMonth }: Omit<ServiceYearProps, 'goalHours'>) {
  const now = dayjs();
  const months = serviceYearMonths(startYear).filter(
    ({ year, month }) => !dayjs(new Date(year, month - 1, 1)).isAfter(now, 'month')
  );

  return (
    <SettingsSection title="Meses do ano de serviço">
      {months.map(({ year, month }, index) => {
        const current = year === now.year() && month === now.month() + 1;
        return (
          <SettingsRow
            key={key(year, month)}
            first={index === 0}
            title={formatMonthName(year, month)}
            description={current ? 'Em curso' : 'Feito'}
            value={formatDuration(minutesByMonth.get(key(year, month)) ?? 0)}
          />
        );
      })}
    </SettingsSection>
  );
}

export { ServiceYearCard, ServiceYearMonths };
