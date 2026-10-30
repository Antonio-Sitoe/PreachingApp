import { SetupLayout } from '@/components/onboarding/setup-layout';
import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { studentsActions } from '@/database/actions';
import type { Student } from '@/database/schemas';
import { requestLocation } from '@/hooks/use-current-location';
import { openAppSettings } from '@/utils/permissions';
import { getDirectionsUrl } from '@/utils/students/detail';
import { formatDayMonth } from '@/utils/students/pause';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';

/** "Captado a 2 de Março, no primeiro contacto" */
function formatLocatedAt(student: Student): string {
  if (!student.locatedAt) return 'Ainda não há ponto no mapa';
  const atCreation = dayjs(student.locatedAt).isSame(student.createdAt, 'day');
  return `Captado a ${formatDayMonth(student.locatedAt)}${atCreation ? ', no primeiro contacto' : ''}`;
}

export default function StudentLocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });
  const student = query.data?.student;

  if (!student) {
    return (
      <SetupLayout title="Localização" onBack={() => router.back()}>
        {null}
      </SetupLayout>
    );
  }
  return <LocationContent key={student.id} student={student} />;
}

function LocationContent({ student }: { student: Student }) {
  const queryClient = useQueryClient();
  const [directions, setDirections] = React.useState(student.directions ?? '');
  const [locating, setLocating] = React.useState(false);
  const savedDirections = React.useRef(student.directions ?? '');
  const directionsUrl = getDirectionsUrl(student);
  const hasPoint = student.latitude != null && student.longitude != null;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['students'] });

  async function saveDirections() {
    const next = directions.trim();
    if (next === savedDirections.current) return;
    try {
      await studentsActions.updateById(student.id, { directions: next });
      savedDirections.current = next;
      await refresh();
    } catch {
      showToast({ message: 'Não foi possível guardar "Como chegar". Tenta outra vez.' });
    }
  }

  async function openMaps() {
    if (!directionsUrl) return;
    try {
      await Linking.openURL(directionsUrl);
    } catch {
      showToast({ message: 'Não foi possível abrir o Google Maps.' });
    }
  }

  async function updateToHere() {
    if (locating) return;
    setLocating(true);
    try {
      const result = await requestLocation();
      if (result === 'blocked') {
        showToast({
          message: 'Sem acesso à localização.',
          action: { label: 'Definições', onPress: () => void openAppSettings() },
        });
        return;
      }
      if (!result) {
        showToast({ message: 'Sem acesso à localização.' });
        return;
      }
      await studentsActions.updateById(student.id, {
        latitude: result.latitude,
        longitude: result.longitude,
        locatedAt: new Date().toISOString(),
        ...(!student.address?.trim() && result.address ? { address: result.address } : {}),
      });
      await refresh();
      showToast({ message: 'Localização actualizada para onde estás agora.' });
    } catch {
      showToast({ message: 'Não foi possível ler a localização. Tenta outra vez.' });
    } finally {
      setLocating(false);
    }
  }

  return (
    <SetupLayout
      title="Localização"
      onBack={async () => {
        await saveDirections();
        router.back();
      }}
      className="bg-background"
      footer={
        <View className="gap-2">
          <Button disabled={!directionsUrl} onPress={openMaps}>
            <AppIcon name="map-pin" size={20} className="text-primary-foreground" />
            <Text>Abrir no Google Maps</Text>
          </Button>
          <Button variant="outline" disabled={locating} onPress={updateToHere}>
            {locating ? <ActivityIndicator /> : null}
            <Text>Actualizar para onde estou agora</Text>
          </Button>
        </View>
      }>
      <SettingsSection>
        <SettingsRow
          first
          title={student.address?.trim() || 'Sem morada'}
          description="Morada"
          onPress={() => router.push(`/student/${student.id}/edit`)}
        />
        <SettingsRow
          title={hasPoint ? 'Ponto guardado' : 'Sem ponto guardado'}
          description={formatLocatedAt(student)}
        />
      </SettingsSection>

      <TextField
        label="Como chegar (opcional)"
        placeholder="Portão verde, depois da padaria"
        value={directions}
        onChangeText={setDirections}
        onEndEditing={saveDirections}
        returnKeyType="done"
      />

      <Text variant="bodyS" className="px-1 text-muted-foreground">
        A localização fica só neste telemóvel.
      </Text>
    </SetupLayout>
  );
}
