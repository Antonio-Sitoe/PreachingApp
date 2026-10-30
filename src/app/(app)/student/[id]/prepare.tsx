import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { studentsActions, visitsActions } from '@/database/actions';
import { cn } from '@/utils/cn';
import { formatRhythm } from '@/utils/students/detail';
import { formatDayMonth } from '@/utils/students/pause';
import { formatBookPart, splitPromised } from '@/utils/today/format';
import { formatAppointmentLabel } from '@/utils/visits/format';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrepareVisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const detailQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });
  const visitsQuery = useQuery({
    queryKey: ['visits', 'student', id],
    queryFn: () => visitsActions.getByStudent(id),
    enabled: Boolean(id),
  });
  const [brought, setBrought] = React.useState<Set<string>>(new Set());

  const detail = detailQuery.data;
  const student = detail?.student;
  const next = detail?.nextVisit;
  const met = (visitsQuery.data ?? []).filter((visit) => visit.outcome === 'met');
  const lastMet = met[0] ?? null;
  const lastTalk = met.find((visit) => visit.notes?.trim()) ?? null;
  const lastLesson = (visitsQuery.data ?? []).find((visit) => visit.lessonNumber)?.lessonNumber;
  const promised = splitPromised(lastMet?.promisedToBring ?? null);

  function toggle(item: string) {
    setBrought((current) => {
      const nextSet = new Set(current);
      if (nextSet.has(item)) nextSet.delete(item);
      else nextSet.add(item);
      return nextSet;
    });
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Preparar a visita" onBack={() => router.back()} />
      {student ? (
        <>
          <ScrollView
            className="flex-1"
            contentContainerClassName="w-full max-w-[640px] self-center gap-4 px-4 pb-6 pt-4"
            showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center gap-4 py-2">
              <Avatar name={student.displayName} size="lg" />
              <View className="min-w-0 flex-1 gap-1.5">
                <Text variant="titleL">{student.displayName}</Text>
                <StageBadge stage={student.stage} />
                {next || student.address ? (
                  <View className="flex-row items-center gap-1.5">
                    <AppIcon name="clock" size={14} className="text-muted-foreground" />
                    <Text variant="bodyS" className="flex-1 text-muted-foreground">
                      {[
                        next ? formatAppointmentLabel(new Date(next.scheduledAt), next.time) : null,
                        student.address,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {lastTalk ? (
              <PrepSection
                icon="chat"
                title={`Última conversa · ${formatDayMonth(lastTalk.visitedAt)}`}>
                <Text>{lastTalk.notes?.trim()}</Text>
              </PrepSection>
            ) : (
              <PrepSection icon="chat" title="Última conversa">
                <Text>
                  {lastMet
                    ? 'As visitas registadas não têm notas.'
                    : 'Ainda não há visitas registadas. Esta vai ser a primeira conversa.'}
                </Text>
              </PrepSection>
            )}

            {lastMet?.pendingQuestion ? (
              <PrepSection icon="question" title="Dúvida pendente" tone="warning">
                <Text>{lastMet.pendingQuestion}</Text>
              </PrepSection>
            ) : null}

            {lastLesson ? (
              <PrepSection icon="book" title="Lição em curso">
                <View className="flex-row flex-wrap items-baseline justify-between gap-2">
                  <Text variant="titleM">Lição {lastLesson}</Text>
                  <Text variant="bodyS" className="text-muted-foreground">
                    {formatBookPart(lastLesson)}
                  </Text>
                </View>
                <Text variant="bodyS" className="text-muted-foreground">
                  {formatRhythm(student.rhythmDays)}
                  {lastMet?.stoppedAtPoint ? ` · pararam em ${lastMet.stoppedAtPoint}` : ''}
                </Text>
              </PrepSection>
            ) : null}

            {promised.length > 0 ? (
              <PrepSection icon="gift" title="Prometi levar">
                {promised.map((item) => (
                  <Pressable
                    key={item}
                    role="checkbox"
                    aria-checked={brought.has(item)}
                    onPress={() => toggle(item)}
                    className="min-h-11 flex-row items-center gap-3">
                    <Checkbox
                      checked={brought.has(item)}
                      onCheckedChange={() => toggle(item)}
                      className="size-5"
                    />
                    <Text className={cn('flex-1', brought.has(item) && 'text-muted-foreground')}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </PrepSection>
            ) : null}
          </ScrollView>

          <View
            className="flex-row gap-2 border-t border-border bg-card px-4 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
            <Button
              variant="outline"
              onPress={() => router.push(`/student/${student.id}/location`)}>
              <AppIcon name="map-pin" size={18} className="text-primary" />
              <Text>Direcções</Text>
            </Button>
            <Button
              className="flex-1"
              onPress={() => router.push(`/visit/new?studentId=${student.id}`)}>
              <Text>Registar visita</Text>
            </Button>
          </View>
        </>
      ) : null}
    </View>
  );
}

type PrepSectionProps = {
  icon: AppIconName;
  title: string;
  tone?: 'default' | 'warning';
  children: React.ReactNode;
};

function PrepSection({ icon, title, tone = 'default', children }: PrepSectionProps) {
  const warning = tone === 'warning';
  return (
    <View className={cn('gap-2 rounded-lg p-4', warning ? 'bg-warning-soft' : 'bg-card')}>
      <View className="flex-row items-center gap-2">
        <AppIcon name={icon} size={18} className={warning ? 'text-warning' : 'text-primary'} />
        <Text
          variant="labelS"
          className={cn('flex-1', warning ? 'text-warning' : 'text-muted-foreground')}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
