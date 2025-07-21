import '@/lib/dayjs';
import './global.css';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { UserStorage } from '@/contexts/UserContext';
import { ReportStorage } from '@/contexts/ReportContext';
import { useColorScheme } from 'nativewind';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Stack, SplashScreen } from 'expo-router';
import { Provider as MaterialProvider } from '@react-native-material/core';
import { DrizzleStudio } from '@/components/studio';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { db } from '@/database/db';
import migrations from '@/database/migrations/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
  const { setColorScheme } = useColorScheme();
  const { getItem } = useAsyncStorage('@THEME_KEY');

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

  useEffect(() => {
    if (loaded && hasSuccessMigration) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasSuccessMigration]);

  if (!loaded) {
    return null;
  }

  return (
    <MaterialProvider>
      <UserStorage>
        <ReportStorage>
          <Stack>
            <Stack.Screen name="(report)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'transparentModal',
                headerShown: false,
              }}
            />
          </Stack>
          {__DEV__ && <DrizzleStudio />}
        </ReportStorage>
      </UserStorage>
    </MaterialProvider>
  );
}
