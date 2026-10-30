import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { PauseSheet } from '@/components/students/pause-sheet';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { STAGES } from '@/constants/stages';
import { studentsActions } from '@/database/actions';
import { cn } from '@/utils/cn';
import {
  formatAvailability,
  formatNextVisit,
  formatPhone,
  getNextVisitHint,
} from '@/utils/students/detail';
import { shortName, withArticle } from '@/utils/students/journey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

export default function StudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const detailQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });

  const detail = detailQuery.data;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Estudante" onBack={() => router.back()} />

      {detailQuery.isLoading ? null : detail ? (
        <StudentDetailContent detail={detail} />
      ) : (
        <View className="flex-1 justify-center">
          <EmptyState
            className="bg-transparent"
            icon="people"
            title="Este estudante já não existe"
            description="Pode ter sido removido noutro ecrã."
            actionLabel="Voltar à lista"
            onActionPress={() => router.back()}
          />
        </View>
      )}
    </View>
  );
}

type StudentDetailContentProps = {
  detail: NonNullable<Awaited<ReturnType<typeof studentsActions.getDetail>>>;
};

function StudentDetailContent({ detail }: StudentDetailContentProps) {
  const { student, nextVisit, availabilities } = detail;
  const queryClient = useQueryClient();
  const [pausing, setPausing] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const paused = student.status === 'paused';
  const availability = formatAvailability(availabilities);
  const nextVisitHint = getNextVisitHint(student, nextVisit);
  const hasContact = Boolean(student.phone || student.address || availability);
  const openEdit = () => router.push(`/student/${student.id}/edit`);
  const openLocation = () => router.push(`/student/${student.id}/location`);

  async function resume() {
    if (busy) return;
    setBusy(true);
    try {
      await studentsActions.resume(student.id);
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      showToast({ message: `${shortName(student.displayName)} voltou à lista.` });
    } catch {
      showToast({ message: 'Não foi possível retomar. Tenta outra vez.' });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      await studentsActions.deleteById(student.id);
      setRemoving(false);
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      showToast({ message: 'Estudante removido.' });
      router.back();
    } catch {
      setBusy(false);
      showToast({ message: 'Não foi possível remover. Tenta outra vez.' });
    }
  }

  async function open(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      showToast({ message: 'Não foi possível abrir. Tenta outra vez.' });
    }
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5"
      showsVerticalScrollIndicator={false}>
      <View className="items-center gap-2.5">
        <Avatar name={student.displayName} size="xl" />
        <Text variant="titleXl" className="text-center">
          {student.displayName}
        </Text>
        <Pressable
          role="button"
          accessibilityLabel={`Etapa e marcos: ${STAGES[student.stage].label}`}
          onPress={() => router.push(`/student/${student.id}/stage`)}
          className="flex-row items-center gap-1.5 rounded-full active:opacity-70">
          <StageBadge stage={student.stage} paused={student.status === 'paused'} />
          <AppIcon name="chevron-right" size={16} className="text-subtle" />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <ActionButton
          primary
          icon="edit"
          label="Registar visita"
          onPress={() => router.push(`/visit/new?studentId=${student.id}`)}
        />
        <ActionButton
          icon="phone"
          label="Ligar"
          disabled={!student.phone}
          onPress={() => student.phone && open(`tel:${student.phone.replace(/\s/g, '')}`)}
        />
        <ActionButton icon="map-pin" label="Direcções" onPress={openLocation} />
      </View>

      <SettingsSection title="Próxima visita">
        <SettingsRow
          first
          title={nextVisit ? formatNextVisit(nextVisit) : 'Sem visita marcada'}
          description={nextVisitHint.text}
          descriptionTone={nextVisitHint.tone}
        />
      </SettingsSection>

      {student.note ? (
        <SettingsSection title="Nota">
          <View className="px-4 py-3.5">
            <Text>{student.note}</Text>
          </View>
        </SettingsSection>
      ) : null}

      {hasContact ? (
        <SettingsSection title="Contacto e morada">
          {student.phone ? (
            <SettingsRow
              first
              title={formatPhone(student.phone)}
              description="Telefone"
              onPress={openEdit}
            />
          ) : null}
          {student.address || availability ? (
            <SettingsRow
              first={!student.phone}
              title={student.address ?? 'Sem morada'}
              description={availability ?? undefined}
              onPress={openLocation}
            />
          ) : null}
        </SettingsSection>
      ) : null}

      <SettingsSection>
        <SettingsRow first title="Editar dados" onPress={openEdit} />
        {paused ? (
          <SettingsRow title="Retomar" onPress={resume} />
        ) : (
          <SettingsRow title="Pôr em pausa" onPress={() => setPausing(true)} />
        )}
        <SettingsRow title="Remover estudante" tone="danger" onPress={() => setRemoving(true)} />
      </SettingsSection>

      <PauseSheet open={pausing} student={student} onClose={() => setPausing(false)} />

      <AlertDialog
        open={removing}
        onClose={() => setRemoving(false)}
        icon="trash"
        title={`Remover ${withArticle(student.displayName, student.gender)}?`}
        description="Apaga a ficha, as visitas e o progresso no estudo. Não dá para desfazer.">
        {paused ? null : (
          <Button
            disabled={busy}
            onPress={() => {
              setRemoving(false);
              setPausing(true);
            }}>
            <Text>Pôr em pausa em vez disso</Text>
          </Button>
        )}
        <Button variant="destructive" disabled={busy} className="mt-1" onPress={remove}>
          <Text>Remover para sempre</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={() => setRemoving(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </ScrollView>
  );
}

type ActionButtonProps = {
  primary?: boolean;
  icon: AppIconName;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function ActionButton({ primary, icon, label, disabled, onPress }: ActionButtonProps) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'min-h-16 flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2',
        primary ? 'bg-primary' : 'border border-border bg-card',
        disabled ? 'opacity-50' : primary ? 'active:opacity-90' : 'active:bg-secondary'
      )}>
      <AppIcon
        name={icon}
        size={20}
        className={primary ? 'text-primary-foreground' : 'text-primary-strong'}
      />
      <Text
        variant="button"
        className={cn(
          'text-center text-[13px] leading-[18px]',
          primary ? 'text-primary-foreground' : 'text-primary-strong'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}
