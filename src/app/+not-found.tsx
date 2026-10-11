import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <View className="flex-1 justify-center gap-4 bg-background p-4">
        <EmptyState
          icon="alert"
          title="Este ecrã não existe"
          description="O endereço que abriste não corresponde a nenhum ecrã do app."
        />
        <Link href="/" asChild>
          <Button>
            <Text>Voltar ao início</Text>
          </Button>
        </Link>
      </View>
    </>
  );
}
