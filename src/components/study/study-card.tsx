import { capitalize } from '@/components/reports/format';
import { Text } from '@/components/ui/text';
import { lessonsActions, visitsActions } from '@/database/actions';
import { BOOK_LESSONS } from '@/database/schemas';
import { currentLesson, partOf } from '@/utils/study/parts';
import { formatLessonPace } from '@/utils/study/format';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ProgressBar } from './progress-bar';

type StudyCardProps = {
  studentId: string;
  footer?: string | null;
};

function StudyCard({ studentId, footer }: StudyCardProps) {
  const lessonsQuery = useQuery({
    queryKey: ['lessons', studentId],
    queryFn: () => lessonsActions.getByStudent(studentId),
  });
  const visitsQuery = useQuery({
    queryKey: ['visits', 'student', studentId],
    queryFn: () => visitsActions.getByStudent(studentId),
  });

  const rows = lessonsQuery.data ?? [];
  const current = currentLesson(rows);
  if (current === null) return null;

  const completed = rows.filter((row) => row.completedAt).length;
  const part = partOf(current);
  const studyVisits = (visitsQuery.data ?? []).filter((visit) => visit.lessonNumber).length;
  const pace = formatLessonPace(studyVisits, completed);

  return (
    <Pressable
      role="button"
      accessibilityLabel={`Progresso no estudo: lição ${current} de ${BOOK_LESSONS}`}
      onPress={() => router.push(`/student/${studentId}/study`)}
      className="gap-3 rounded-lg border border-border bg-card p-4 active:bg-secondary">
      <View className="flex-row flex-wrap items-baseline gap-x-2">
        <Text className="font-display text-[25px] leading-8 text-primary-strong">
          Lição {current}
        </Text>
        <Text variant="bodyS" className="text-muted-foreground">
          de {BOOK_LESSONS} · parte {part.part} ({part.from} a {part.to})
        </Text>
      </View>
      <ProgressBar
        value={completed}
        max={BOOK_LESSONS}
        label={`${completed} de ${BOOK_LESSONS} lições concluídas`}
      />
      <Text variant="bodyS" className="text-muted-foreground">
        {[pace ? capitalize(pace) : `${completed} de ${BOOK_LESSONS} concluídas`, footer]
          .filter(Boolean)
          .join(' · ')}
      </Text>
    </Pressable>
  );
}

export { StudyCard };
export type { StudyCardProps };
