import { TagChip } from '@/components/notes/list';
import { SettingsSection } from '@/components/settings/grouped-list';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { VisitRow } from '@/components/visits/visit-row';
import { studentsActions, visitsActions } from '@/database/actions';
import type { Visit } from '@/database/schemas';
import { formatDayMonth } from '@/utils/students/pause';
import { formatMonthGroup } from '@/utils/visits/format';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'study', label: 'Com estudo' },
  { id: 'attempts', label: 'Tentativas' },
] as const;

type VisitFilter = (typeof FILTERS)[number]['id'];

function matches(visit: Visit, filter: VisitFilter): boolean {
  if (filter === 'study') return Boolean(visit.lessonNumber);
  if (filter === 'attempts') return visit.outcome !== 'met';
  return true;
}

export default function StudentVisitsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [filter, setFilter] = React.useState<VisitFilter>('all');
  const studentQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });
  const visitsQuery = useQuery({
    queryKey: ['visits', 'student', id],
    queryFn: () => visitsActions.getByStudent(id),
    enabled: Boolean(id),
  });

  const student = studentQuery.data?.student;
  const all = visitsQuery.data ?? [];
  const visible = all.filter((visit) => matches(visit, filter));
  const groups = new Map<string, Visit[]>();
  for (const visit of visible) {
    const key = dayjs(visit.visitedAt).format('YYYY-MM');
    groups.set(key, [...(groups.get(key) ?? []), visit]);
  }
  const first = all[all.length - 1];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Visitas" onBack={() => router.back()} />
      {student ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="w-full max-w-[640px] grow self-center gap-5 px-4 pb-8 pt-5"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center gap-3">
            <Avatar name={student.displayName} />
            <View className="min-w-0 flex-1 gap-0.5">
              <Text variant="titleM" numberOfLines={2}>
                {student.displayName}
              </Text>
              <Text variant="bodyS" className="text-muted-foreground">
                {first
                  ? `${all.length} ${all.length === 1 ? 'visita' : 'visitas'} desde ${formatDayMonth(first.visitedAt)}`
                  : `Primeiro contacto a ${formatDayMonth(student.createdAt)}`}
              </Text>
            </View>
          </View>

          {all.length === 0 ? (
            <View className="grow justify-center">
              <EmptyState
                className="bg-transparent"
                icon="calendar"
                title="Ainda não há visitas"
                description="Depois da primeira visita, o que conversaram fica aqui."
                actionLabel="Registar visita"
                onActionPress={() => router.push(`/visit/new?studentId=${student.id}`)}
              />
            </View>
          ) : (
            <>
              <View role="group" aria-label="Filtrar" className="flex-row flex-wrap gap-2">
                {FILTERS.map((option) => (
                  <TagChip
                    key={option.id}
                    label={option.label}
                    active={filter === option.id}
                    onPress={() => setFilter(option.id)}
                  />
                ))}
              </View>

              {visible.length === 0 ? (
                <Text className="px-1 text-center text-muted-foreground">
                  Nenhuma visita neste filtro.
                </Text>
              ) : (
                [...groups.entries()].map(([key, items]) => (
                  <SettingsSection key={key} title={formatMonthGroup(items[0].visitedAt)}>
                    {items.map((visit, index) => (
                      <VisitRow key={visit.id} visit={visit} first={index === 0} />
                    ))}
                  </SettingsSection>
                ))
              )}
            </>
          )}
        </ScrollView>
      ) : null}
    </View>
  );
}
