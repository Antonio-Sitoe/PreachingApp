import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { dayKey, formatMonthTitle, formatReturnSummary } from '@/utils/students/return-date';
import dayjs, { type Dayjs } from 'dayjs';
import { Pressable, View } from 'react-native';

const WEEKDAY_INITIALS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

/** As semanas do mês, a começar à segunda. `null` preenche os dias fora do mês. */
function monthWeeks(month: Dayjs): (Dayjs | null)[][] {
  const first = month.startOf('month');
  const leading = (first.day() + 6) % 7;
  const cells: (Dayjs | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: first.daysInMonth() }, (_, index) => first.add(index, 'day')),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

type MonthCalendarProps = {
  month: Date;
  selected: Date;
  scheduledDays: ReadonlySet<string>;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
};

function MonthCalendar({
  month,
  selected,
  scheduledDays,
  onMonthChange,
  onSelect,
}: MonthCalendarProps) {
  const today = dayjs().startOf('day');
  const current = dayjs(month).startOf('month');
  const weeks = monthWeeks(current);
  const canGoBack = current.isAfter(today, 'month');

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Pressable
          role="button"
          accessibilityLabel="Mês anterior"
          disabled={!canGoBack}
          onPress={() => onMonthChange(current.subtract(1, 'month').toDate())}
          className="size-11 items-center justify-center rounded-full active:bg-secondary disabled:opacity-30">
          <AppIcon name="chevron-left" size={22} className="text-foreground" />
        </Pressable>
        <Text variant="titleM">{formatMonthTitle(month)}</Text>
        <Pressable
          role="button"
          accessibilityLabel="Mês seguinte"
          onPress={() => onMonthChange(current.add(1, 'month').toDate())}
          className="size-11 items-center justify-center rounded-full active:bg-secondary">
          <AppIcon name="chevron-right" size={22} className="text-foreground" />
        </Pressable>
      </View>

      <View className="flex-row">
        {WEEKDAY_INITIALS.map((initial, index) => (
          <Text key={index} variant="labelS" className="flex-1 text-center text-muted-foreground">
            {initial}
          </Text>
        ))}
      </View>

      {weeks.map((week, index) => (
        <View key={index} className="flex-row">
          {week.map((day, column) =>
            day ? (
              <CalendarDay
                key={column}
                day={day}
                isToday={day.isSame(today, 'day')}
                isSelected={day.isSame(selected, 'day')}
                isPast={day.isBefore(today, 'day')}
                hasVisits={scheduledDays.has(dayKey(day))}
                onPress={() => onSelect(day.toDate())}
              />
            ) : (
              <View key={column} className="flex-1" />
            )
          )}
        </View>
      ))}

      <View className="flex-row items-center justify-center gap-5">
        <View className="flex-row items-center gap-1.5">
          <View className="size-3.5 rounded-full border-[1.5px] border-primary" />
          <Text variant="bodyS" className="text-muted-foreground">
            Hoje
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="size-1.5 rounded-full bg-primary" />
          <Text variant="bodyS" className="text-muted-foreground">
            Já tens visitas marcadas
          </Text>
        </View>
      </View>
    </View>
  );
}

type CalendarDayProps = {
  day: Dayjs;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  hasVisits: boolean;
  onPress: () => void;
};

function CalendarDay({ day, isToday, isSelected, isPast, hasVisits, onPress }: CalendarDayProps) {
  return (
    <View className="flex-1 items-center">
      <Pressable
        role="button"
        accessibilityLabel={formatReturnSummary(day.toDate())}
        aria-selected={isSelected}
        disabled={isPast}
        onPress={onPress}
        className={cn(
          'aspect-square w-full max-w-11 items-center justify-center rounded-full',
          isToday && !isSelected && 'border-[1.5px] border-primary',
          isSelected ? 'bg-primary' : 'active:bg-secondary'
        )}>
        <Text
          variant="titleS"
          className={cn(
            isSelected && 'text-primary-foreground',
            isToday && !isSelected && 'text-primary',
            isPast && 'text-subtle'
          )}>
          {day.date()}
        </Text>
      </Pressable>
      <View className={cn('mt-0.5 size-1.5 rounded-full', hasVisits && 'bg-primary')} />
    </View>
  );
}

export { MonthCalendar };
export type { MonthCalendarProps };
