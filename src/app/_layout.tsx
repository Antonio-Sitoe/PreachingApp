import '@/lib/dayjs';
import './global.css';
import 'react-native-get-random-values';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Stack, SplashScreen } from 'expo-router';
import { DrizzleStudio } from '@/components/studio';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { db } from '@/database/db';
import migrations from '@/database/migrations/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import { notificationManager } from '@/lib/notifications/weekly-notification';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

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
  const { setColorScheme, colorScheme } = useColorScheme();
  const { getItem } = useAsyncStorage('@THEME_KEY');
  const { autoSignIn } = useUser();

  useEffect(() => {
    async function defineDefaultTheme() {
      const theme = await getItem();
      console.log('theme', theme === 'dark' ? 'dark' : 'light');
      setColorScheme(theme === 'dark' ? 'dark' : 'light');
    }
    defineDefaultTheme();
  }, [getItem, setColorScheme]);

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
    if (!loaded) return;
    notificationManager.setupNotificationListener();
    return () => {
      notificationManager.cleanup();
    };
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
            name="modal"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
