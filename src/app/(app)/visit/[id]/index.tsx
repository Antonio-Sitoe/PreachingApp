import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { OutcomeBadge } from '@/components/visits/visit-row';
import { queryKeys } from '@/constants/query-keys';
import { lessonsActions, visitsActions } from '@/database/actions';
import type { UndoableAdvance, VisitDetail } from '@/database/@types';
import { cn } from '@/utils/cn';
import { formatDayMonth } from '@/utils/students/pause';
import { formatLessons } from '@/utils/study/format';
import { formatUndoBlock } from '@/utils/study/lesson-edit';
import {
  formatAppointmentLabel,
  formatVisitLongDate,
  parseScriptures,
  timeOf,
} from '@/utils/visits/format';
import { refreshVisitData } from '@/utils/visits/refresh';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function VisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: queryKeys.visits.detail(id),
    queryFn: () => visitsActions.getById(id),
    enabled: Boolean(id),
  });

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Visita" onBack={() => router.back()} />
      {query.isLoading ? null : query.data ? (
        <VisitContent detail={query.data} />
      ) : (
        <View className="flex-1 justify-center">
          <EmptyState
            className="bg-transparent"
            icon="calendar"
            title="Esta visita já não existe"
            description="Pode ter sido apagada noutro ecrã."
            actionLabel="Voltar"
            onActionPress={() => router.back()}
          />
        </View>
      )}
    </View>
  );
}

function undoDescription(undoable: UndoableAdvance | null | undefined): string {
  if (!undoable) return '';
  const { lesson, previousVisitLesson } = undoable.advance;
  const visitLesson = previousVisitLesson ? `na lição ${previousVisitLesson}` : 'sem lição';
  const notes =
    undoable.lessonsWithNotes.length > 0
      ? ` A nota da ${formatLessons(undoable.lessonsWithNotes)} deixa de aparecer.`
      : '';
  return `A lição ${lesson} deixa de contar como avanço e a visita fica ${visitLesson}.${notes}`;
}

function VisitContent({ detail }: { detail: VisitDetail }) {
  const queryClient = useQueryClient();
  const { visit, student, next } = detail;
  const [deleting, setDeleting] = React.useState(false);
  const [undoing, setUndoing] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const advanceQuery = useQuery({
    queryKey: queryKeys.lessons.advance(visit.id),
    queryFn: () => lessonsActions.getUndoableAdvance(visit.id),
  });
  const undoable = advanceQuery.data;
  const scriptures = parseScriptures(visit.scriptures);
  const met = visit.outcome === 'met';

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      const undone = await visitsActions.remove(visit.id);
      setDeleting(false);
      await refreshVisitData(queryClient);
      showToast(
        undone
          ? { message: 'Visita apagada. O progresso no estudo voltou atrás.' }
          : visit.lessonNumber
            ? {
                message: 'Visita apagada. O progresso no estudo não mudou.',
                action: {
                  label: 'Ver estudo',
                  onPress: () => router.push(`/student/${student.id}/study`),
                },
              }
            : { message: 'Visita apagada.' }
      );
      router.back();
    } catch {
      setBusy(false);
      showToast({ message: 'Não foi possível apagar a visita. Tenta outra vez.' });
    }
  }

  async function undoLessonAdvance() {
    if (!undoable || busy) return;
    setBusy(true);
    try {
      const undone = lessonsActions.undoAdvance(undoable.advance.id, { restoreVisitLesson: true });
      setUndoing(false);
      await refreshVisitData(queryClient);
      showToast({
        message: undone ? 'Avanço desfeito.' : 'Já não dá para desfazer este avanço.',
      });
    } catch {
      showToast({ message: 'Não foi possível desfazer. Tenta outra vez.' });
    } finally {
      setBusy(false);
    }
  }

  const rows = [
    met ? { label: 'Textos usados', value: scriptures.join(', ') || 'Nenhum' } : null,
    visit.lessonNumber
      ? {
          label: 'Lição',
          value: visit.stoppedAtPoint
            ? `${visit.lessonNumber} · ${visit.stoppedAtPoint}`
            : String(visit.lessonNumber),
        }
      : null,
    met ? { label: 'Dúvida pendente', value: visit.pendingQuestion || 'Nenhuma' } : null,
    { label: 'Prometi levar', value: visit.promisedToBring || 'Nada' },
    next
      ? {
          label: 'Próxima visita',
          value: formatAppointmentLabel(new Date(next.scheduledAt), next.time),
        }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5"
      showsVerticalScrollIndicator={false}>
      <View className="gap-1.5">
        <Text variant="bodyS" className="text-muted-foreground">
          {student.displayName}
        </Text>
        <Text variant="titleXl">{formatVisitLongDate(visit.visitedAt)}</Text>
        <View className="flex-row items-center gap-2">
          <OutcomeBadge outcome={visit.outcome} />
          <Text variant="bodyS" className="text-muted-foreground">
            {timeOf(new Date(visit.visitedAt))}
          </Text>
        </View>
      </View>

      {visit.notes ? (
        <SettingsSection title={met ? 'O que conversaram' : 'Nota'}>
          <View className="px-4 py-3.5">
            <Text>{visit.notes}</Text>
          </View>
        </SettingsSection>
      ) : null}

      <SettingsSection title="Detalhes">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={cn(
              'min-h-12 flex-row items-center gap-3 px-4 py-2',
              index > 0 && 'border-t border-border'
            )}>
            <Text variant="bodyS" className="flex-1 text-muted-foreground">
              {row.label}
            </Text>
            <Text className="max-w-[60%] text-right">{row.value}</Text>
          </View>
        ))}
      </SettingsSection>

      {undoable ? (
        <SettingsSection title="Estudo">
          <SettingsRow
            first
            title={
              undoable.blocked
                ? `Avançou para a lição ${undoable.advance.lesson}`
                : 'Desfazer avanço'
            }
            description={
              undoable.blocked
                ? formatUndoBlock(undoable.blocked)
                : `Esta visita avançou para a lição ${undoable.advance.lesson}.`
            }
            onPress={undoable.blocked ? undefined : () => setUndoing(true)}
          />
        </SettingsSection>
      ) : null}

      <SettingsSection>
        <SettingsRow
          first
          title="Editar visita"
          onPress={() => router.push(`/visit/${visit.id}/edit`)}
        />
        <SettingsRow title="Apagar visita" tone="danger" onPress={() => setDeleting(true)} />
      </SettingsSection>

      <AlertDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        icon="trash"
        title="Apagar esta visita?"
        description={`A visita de ${formatDayMonth(visit.visitedAt)} sai do histórico e deixa de contar no relatório.`}>
        <Button variant="destructive" disabled={busy} onPress={remove}>
          <Text>Apagar visita</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={() => setDeleting(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>

      <AlertDialog
        open={undoing}
        onClose={() => setUndoing(false)}
        icon="book"
        tone="brand"
        title="Desfazer este avanço?"
        description={undoDescription(undoable)}>
        <Button disabled={busy} onPress={undoLessonAdvance}>
          <Text>Desfazer avanço</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={() => setUndoing(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </ScrollView>
  );
}
