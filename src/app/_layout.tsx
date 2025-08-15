import '@/lib/dayjs';
import './global.css';
import 'react-native-get-random-values';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import useTheme from '@/hooks/useTheme';
import { Stack, SplashScreen } from 'expo-router';
import { DrizzleStudio } from '@/components/studio';

import { db } from '@/database/db';
import migrations from '@/database/migrations/migrations';
import { useUser } from '@/contexts/UserContext';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayoutNav() {
  const { success: hasSuccessMigration, error: errorDbMigration } =
    useMigrations(db, migrations);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    IBMPLEX_Regular: require('../assets/fonts/IBMPlexSansCondensed-Regular.ttf'),
    IBMPLEX_Medium: require('../assets/fonts/IBMPlexSansCondensed-Medium.ttf'),
    IBMPLEX_Bold: require('../assets/fonts/IBMPlexSansCondensed-Bold.ttf'),
  });
  const { colorScheme, initializeTheme } = useTheme();
  const { autoSignIn } = useUser();

  // biome-ignore lint/correctness/useExhaustiveDependencies: initialize theme only once
  useEffect(() => {
    initializeTheme();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (errorDbMigration) throw errorDbMigration;
    if (error) throw error;
  }, [error, errorDbMigration]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: autoSignIn doesn't need to be in deps as it's stable
  useEffect(() => {
    if (loaded) {
      autoSignIn();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && hasSuccessMigration) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasSuccessMigration]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider
      mode={colorScheme === 'dark' ? 'dark' : 'light'}
      style={{ flex: 1 }}
    >
      <QueryClientProvider client={queryClient}>
        {__DEV__ && <DrizzleStudio />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="note"
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
