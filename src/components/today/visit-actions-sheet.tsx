import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import type { TodayItem } from '@/database/actions';
import { cn } from '@/utils/cn';
import { daysAhead, formatShortDay, nextSaturday } from '@/utils/students/return-date';
import { formatAppointmentLabel } from '@/utils/visits/format';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type VisitActionsSheetProps = {
  item: TodayItem | null;
  onDone: (item: TodayItem) => void;
  onNotHome: (item: TodayItem) => void;
  onPostpone: (item: TodayItem, date: Date) => void;
  onClose: () => void;
};

function VisitActionsSheet({
  item,
  onDone,
  onNotHome,
  onPostpone,
  onClose,
}: VisitActionsSheetProps) {
  const [pickingDate, setPickingDate] = React.useState(false);

  if (!item) return null;
  const { student, appointment } = item;
  const options = [
    { label: 'Amanhã', date: daysAhead(1) },
    { label: formatShortDay(nextSaturday()), date: nextSaturday() },
    { label: 'Próxima semana', date: daysAhead(7) },
  ].filter(
    (option, index, all) =>
      all.findIndex((other) => dayjs(other.date).isSame(option.date, 'day')) === index
  );

  function onPicked(_event: DateTimePickerChangeEvent, date: Date) {
    setPickingDate(false);
    if (item) onPostpone(item, date);
  }

  return (
    <BottomSheet open onClose={onClose}>
      <View className="flex-row items-center gap-3">
        <Avatar name={student.displayName} />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="titleL" numberOfLines={2}>
            {student.displayName}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <StageBadge stage={student.stage} />
            <Text variant="labelS" className="text-muted-foreground">
              {formatAppointmentLabel(new Date(appointment.scheduledAt), appointment.time)}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-2">
        <ActionRow
          icon="check"
          tone="success"
          title="Visita feita"
          description="Registar o que conversaram e a próxima visita"
          onPress={() => onDone(item)}
        />
        <ActionRow
          icon="not-home"
          tone="muted"
          title="Não estava em casa"
          description="Fica como tentativa. Um toque, com desfazer"
          onPress={() => onNotHome(item)}
        />
      </View>

      <View className="gap-2">
        <FieldLabel>Adiar para</FieldLabel>
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => (
            <ChoiceButton
              key={option.label}
              label={option.label}
              onPress={() => onPostpone(item, option.date)}
            />
          ))}
          <ChoiceButton
            label="Escolher data"
            icon="calendar"
            primary
            onPress={() => setPickingDate(true)}
          />
        </View>
      </View>

      <Button variant="ghost" className="min-h-12" onPress={onClose}>
        <Text>Cancelar</Text>
      </Button>

      {pickingDate ? (
        <DateTimePicker
          value={daysAhead(1)}
          mode="date"
          minimumDate={daysAhead(1)}
          onValueChange={onPicked}
          onDismiss={() => setPickingDate(false)}
        />
      ) : null}
    </BottomSheet>
  );
}

type ActionRowProps = {
  icon: AppIconName;
  tone: 'success' | 'muted';
  title: string;
  description: string;
  onPress: () => void;
};

function ActionRow({ icon, tone, title, description, onPress }: ActionRowProps) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className="min-h-16 flex-row items-center gap-3 rounded-lg border border-border px-4 py-3 active:bg-secondary">
      <View
        className={cn(
          'size-10 items-center justify-center rounded-full',
          tone === 'success' ? 'bg-success-soft' : 'bg-muted'
        )}>
        <AppIcon
          name={icon}
          size={20}
          className={tone === 'success' ? 'text-success' : 'text-muted-foreground'}
        />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="titleS">{title}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

type ChoiceButtonProps = {
  label: string;
  icon?: AppIconName;
  primary?: boolean;
  onPress: () => void;
};

function ChoiceButton({ label, icon, primary, onPress }: ChoiceButtonProps) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className="min-h-12 grow basis-[45%] flex-row items-center justify-center gap-2 rounded-lg border border-border bg-card px-2 py-2 active:bg-secondary">
      {icon ? <AppIcon name={icon} size={18} className="text-primary" /> : null}
      <Text
        className={cn(
          'text-center font-display-medium text-[15px] leading-5',
          primary ? 'text-primary' : 'text-foreground'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

export { VisitActionsSheet };
export type { VisitActionsSheetProps };
