import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import type { Student } from '@/database/schemas';
import { cn } from '@/utils/cn';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

type TodayCardProps = {
  student: Student;
  /** "10:00", "há 2 dias" */
  when?: string;
  whenTone?: 'default' | 'warning';
  detail?: string | null;
  done?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

function TodayCard({
  student,
  when,
  whenTone = 'default',
  detail,
  done,
  actionLabel,
  onAction,
}: TodayCardProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-lg bg-card py-3.5 pl-4 pr-3">
      <Avatar name={student.displayName} className={done ? 'bg-muted' : undefined} />
      <Pressable
        role="button"
        onPress={() => router.push(`/student/${student.id}`)}
        className="min-w-0 flex-1 gap-1 active:opacity-70">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            variant="titleS"
            numberOfLines={2}
            className={cn('shrink', done && 'text-muted-foreground line-through')}>
            {student.displayName}
          </Text>
          {when ? (
            <Text
              variant="labelS"
              className={cn(
                'pt-0.5',
                whenTone === 'warning' ? 'text-warning' : 'text-muted-foreground'
              )}>
              {when}
            </Text>
          ) : null}
        </View>
        {detail ? (
          <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
            {detail}
          </Text>
        ) : null}
        {done ? null : <StageBadge stage={student.stage} />}
      </Pressable>
      {done ? (
        <View
          role="img"
          aria-label="Feita"
          className="size-11 items-center justify-center rounded-full bg-success">
          <AppIcon name="check" size={20} strokeWidth={2.5} className="text-white" />
        </View>
      ) : onAction ? (
        <Pressable
          role="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          className="size-11 items-center justify-center rounded-full border-[1.5px] border-border active:bg-secondary">
          <AppIcon name="check" size={20} className="text-primary" />
        </Pressable>
      ) : null}
    </View>
  );
}

type SectionTitleProps = {
  title: string;
  badge?: string;
  tone?: 'default' | 'warning';
};

function SectionTitle({ title, badge, tone = 'default' }: SectionTitleProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Text variant="titleM">{title}</Text>
      {badge ? (
        <View
          className={cn(
            'rounded-full px-2 py-[3px]',
            tone === 'warning' ? 'bg-warning-soft' : 'bg-secondary'
          )}>
          <Text
            variant="labelS"
            className={tone === 'warning' ? 'text-warning' : 'text-primary-strong'}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export { SectionTitle, TodayCard };
export type { SectionTitleProps, TodayCardProps };
