import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { OutcomeBadge } from '@/components/visits/visit-row';
import { type VisitDetail, visitsActions } from '@/database/actions';
import { parseScriptures } from '@/database/actions/visits';
import { cn } from '@/utils/cn';
import { formatDayMonth } from '@/utils/students/pause';
import { formatAppointmentLabel, formatVisitLongDate, timeOf } from '@/utils/visits/format';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function VisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['visits', 'detail', id],
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

function VisitContent({ detail }: { detail: VisitDetail }) {
  const queryClient = useQueryClient();
  const { visit, student, next } = detail;
  const [deleting, setDeleting] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const scriptures = parseScriptures(visit.scriptures);
  const met = visit.outcome === 'met';

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      await visitsActions.remove(visit.id);
      setDeleting(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['visits'] }),
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
      ]);
      showToast({ message: 'Visita apagada.' });
      router.back();
    } catch {
      setBusy(false);
      showToast({ message: 'Não foi possível apagar a visita. Tenta outra vez.' });
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
    </ScrollView>
  );
}
