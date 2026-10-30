import { ScreenHeader } from '@/components/ui/screen-header';
import { VisitForm } from '@/components/visits/visit-form';
import { visitsActions } from '@/database/actions';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function EditVisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['visits', 'detail', id],
    queryFn: () => visitsActions.getById(id),
    enabled: Boolean(id),
  });

  if (query.data) return <VisitForm editing={query.data.visit} />;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Editar visita" onBack={() => router.back()} />
    </View>
  );
}
