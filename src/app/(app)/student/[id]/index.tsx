import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { studentsActions } from '@/database/actions';
import { cn } from '@/utils/cn';
import {
  formatAvailability,
  formatNextVisit,
  formatPhone,
  getDirectionsUrl,
  getNextVisitHint,
} from '@/utils/students/detail';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
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
  const directionsUrl = getDirectionsUrl(student);
  const availability = formatAvailability(availabilities);
  const nextVisitHint = getNextVisitHint(student, nextVisit);
  const hasContact = Boolean(student.phone || student.address || availability);
  const openEdit = () => router.push(`/student/${student.id}/edit`);

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
        <StageBadge
          stage={student.stage}
          paused={student.status === 'paused'}
          className="self-center"
        />
      </View>

      <View className="flex-row gap-2">
        <ActionButton
          icon="phone"
          label="Ligar"
          disabled={!student.phone}
          onPress={() => student.phone && open(`tel:${student.phone.replace(/\s/g, '')}`)}
        />
        <ActionButton
          icon="map-pin"
          label="Direcções"
          disabled={!directionsUrl}
          onPress={() => directionsUrl && open(directionsUrl)}
        />
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
              onPress={openEdit}
            />
          ) : null}
        </SettingsSection>
      ) : null}

      <SettingsSection>
        <SettingsRow first title="Editar dados" onPress={openEdit} />
      </SettingsSection>
    </ScrollView>
  );
}

type ActionButtonProps = {
  icon: AppIconName;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function ActionButton({ icon, label, disabled, onPress }: ActionButtonProps) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'h-16 flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-card',
        disabled ? 'opacity-50' : 'active:bg-secondary'
      )}>
      <AppIcon name={icon} size={20} className="text-primary-strong" />
      <Text variant="button" className="text-[13px] leading-[18px] text-primary-strong">
        {label}
      </Text>
    </Pressable>
  );
}
