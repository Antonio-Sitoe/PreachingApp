import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function StudentsScreen() {
  return (
    <Screen fab={<Fab accessibilityLabel="Novo contacto" />}>
      <Text variant="titleXl">Estudantes</Text>
      <EmptyState
        icon="people"
        title="Ainda não há pessoas"
        description="Regista a primeira pessoa que estás a acompanhar."
      />
    </Screen>
  );
}
