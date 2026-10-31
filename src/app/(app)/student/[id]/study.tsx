import { PartReviewSheet } from '@/components/study/part-review-sheet';
import { ProgressBar } from '@/components/study/progress-bar';
import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { lessonsActions, studentsActions, visitsActions } from '@/database/actions';
import { BOOK_LESSONS, type LessonProgress } from '@/database/schemas';
import { cn } from '@/utils/cn';
import { formatDayMonth } from '@/utils/students/pause';
import {
  BOOK_PARTS,
  type BookPart,
  currentLesson,
  formatPart,
  lessonState,
  partOf,
  partSize,
} from '@/utils/study/parts';
import { formatLessonPace } from '@/utils/study/format';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function StudyProgressScreen() {
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const [reviewing, setReviewing] = React.useState<number | null>(review ? Number(review) : null);

  const studentQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });
  const lessonsQuery = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => lessonsActions.getByStudent(id),
    enabled: Boolean(id),
  });
  const visitsQuery = useQuery({
    queryKey: ['visits', 'student', id],
    queryFn: () => visitsActions.getByStudent(id),
    enabled: Boolean(id),
  });
  const reviewedQuery = useQuery({
    queryKey: ['milestones', id, 'reviews'],
    queryFn: () => lessonsActions.getReviewedParts(id),
    enabled: Boolean(id),
  });

  const student = studentQuery.data?.student;
  const rows = lessonsQuery.data ?? [];
  const current = currentLesson(rows);
  const completed = rows.filter((row) => row.completedAt).length;
  const studyVisits = (visitsQuery.data ?? []).filter((visit) => visit.lessonNumber).length;
  const reviewed = new Set(reviewedQuery.data ?? []);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Progresso no estudo" onBack={() => router.back()} />
      {student && lessonsQuery.data ? (
        current === null ? (
          <View className="flex-1 gap-5 px-4 pt-5">
            <View className="flex-row items-center gap-3">
              <Avatar name={student.displayName} />
              <View className="min-w-0 flex-1 gap-0.5">
                <Text variant="titleM">{student.displayName}</Text>
                <Text variant="bodyS" className="text-muted-foreground">
                  Registado a {formatDayMonth(student.createdAt)}
                </Text>
              </View>
            </View>
            <View className="flex-1 items-center justify-center gap-4 px-4 pb-10">
              <View className="size-[72px] items-center justify-center rounded-full bg-secondary">
                <AppIcon name="book" size={32} className="text-primary" />
              </View>
              <View className="gap-2">
                <Text variant="titleM" className="text-center">
                  O estudo ainda não começou
                </Text>
                <Text className="text-center text-muted-foreground">
                  Quando registares uma visita com estudo, a lição aparece aqui e o percurso passa a
                  "Estudo iniciado".
                </Text>
              </View>
              <Button
                className="self-stretch"
                onPress={() => router.push(`/visit/new?studentId=${student.id}&study=1`)}>
                <Text>Registar visita com estudo</Text>
              </Button>
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5"
            showsVerticalScrollIndicator={false}>
            <View className="gap-3 rounded-lg border border-border bg-card p-4">
              <View className="flex-row flex-wrap items-baseline gap-x-2">
                <Text className="font-display text-[45px] leading-[48px] text-primary-strong">
                  Lição {current}
                </Text>
                <Text variant="titleS" className="text-muted-foreground">
                  de {BOOK_LESSONS}
                </Text>
              </View>
              <ProgressBar
                value={completed}
                max={BOOK_LESSONS}
                label={`${completed} de ${BOOK_LESSONS} lições concluídas`}
              />
              <Text variant="bodyS" className="text-muted-foreground">
                {[student.displayName, formatLessonPace(studyVisits, completed)]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>

            {BOOK_PARTS.map((part) => (
              <PartSection
                key={part.part}
                part={part}
                rows={rows}
                current={current}
                reviewed={reviewed.has(part.part)}
                onReview={() => setReviewing(part.part)}
                onLesson={(lesson) => router.push(`/student/${student.id}/lesson/${lesson}`)}
              />
            ))}
          </ScrollView>
        )
      ) : null}

      {student ? (
        <PartReviewSheet part={reviewing} student={student} onClose={() => setReviewing(null)} />
      ) : null}
    </View>
  );
}

type PartSectionProps = {
  part: BookPart;
  rows: LessonProgress[];
  current: number;
  reviewed: boolean;
  onReview: () => void;
  onLesson: (lesson: number) => void;
};

function PartSection({ part, rows, current, reviewed, onReview, onLesson }: PartSectionProps) {
  const size = partSize(part);
  const done = rows.filter(
    (row) => row.completedAt && row.lessonNumber >= part.from && row.lessonNumber <= part.to
  ).length;
  const isCurrent = partOf(current).part === part.part;
  const finished = done === size;
  const status = finished
    ? reviewed
      ? 'Concluída · revista'
      : 'Concluída'
    : done === 0 && !isCurrent
      ? 'Por começar'
      : `${done} de ${size}`;

  return (
    <View className="gap-5">
      <Pressable
        role="button"
        disabled={!finished}
        accessibilityLabel={`${formatPart(part)}, ${status}`}
        onPress={onReview}
        className={cn(
          'gap-2.5 rounded-lg bg-card px-4 py-3.5',
          isCurrent ? 'border-[1.5px] border-primary' : 'border border-border',
          finished && 'active:bg-secondary'
        )}>
        <View className="flex-row flex-wrap items-baseline justify-between gap-x-2">
          <Text variant="titleS" className="font-display-semibold">
            {formatPart(part)}
          </Text>
          <Text variant="bodyS" className="text-muted-foreground">
            {status}
          </Text>
        </View>
        <ProgressBar value={done} max={size} label={`${done} de ${size} lições`} />
      </Pressable>

      {isCurrent ? (
        <View className="gap-2">
          <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
            Lições da parte {part.part}
          </Text>
          <View className="-m-[3px] flex-row flex-wrap">
            {Array.from({ length: size }, (_, index) => part.from + index).map((lesson) => {
              const state = lessonState(rows, lesson);
              return (
                <View key={lesson} className="w-[16.6%] p-[3px]">
                  <Pressable
                    role="button"
                    accessibilityLabel={`Lição ${lesson}, ${
                      state === 'done' ? 'concluída' : state === 'current' ? 'actual' : 'por fazer'
                    }`}
                    onPress={() => onLesson(lesson)}
                    className={cn(
                      'min-h-11 items-center justify-center rounded-lg border',
                      state === 'done' && 'border-transparent bg-success-soft',
                      state === 'current' && 'border-transparent bg-primary',
                      state === 'todo' && 'border-border bg-card'
                    )}>
                    <Text
                      className={cn(
                        'font-display-semibold text-[14px]',
                        state === 'done' && 'text-success',
                        state === 'current' && 'text-primary-foreground',
                        state === 'todo' && 'text-muted-foreground'
                      )}>
                      {lesson}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
