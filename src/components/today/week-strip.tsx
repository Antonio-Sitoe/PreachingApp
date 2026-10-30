import { Text } from '@/components/ui/text';
import { WEEKDAY_OPTIONS } from '@/constants/students';
import { cn } from '@/utils/cn';
import { weekOf } from '@/utils/today/format';
import dayjs from 'dayjs';
import { View } from 'react-native';

type WeekStripProps = {
  /** YYYY-MM-DD dos dias com visitas marcadas. */
  markedDays: readonly string[];
};

function WeekStrip({ markedDays }: WeekStripProps) {
  const today = dayjs();
  const marked = new Set(markedDays);
  return (
    <View aria-label="Semana" className="flex-row rounded-lg bg-card px-2 py-3.5">
      {weekOf().map((date, index) => {
        const day = dayjs(date);
        const isToday = day.isSame(today, 'day');
        return (
          <View key={index} className="flex-1 items-center gap-2">
            <Text variant="labelS" className="text-muted-foreground">
              {WEEKDAY_OPTIONS[index].label}
            </Text>
            <View
              className={cn(
                'size-9 items-center justify-center rounded-full',
                isToday && 'bg-primary'
              )}>
              <Text
                variant="titleS"
                className={isToday ? 'font-display-semibold text-primary-foreground' : undefined}>
                {day.date()}
              </Text>
            </View>
            <View
              className={cn(
                'size-1 rounded-full',
                marked.has(day.format('YYYY-MM-DD')) && 'bg-primary'
              )}
            />
          </View>
        );
      })}
    </View>
  );
}

export { WeekStrip };
export type { WeekStripProps };
