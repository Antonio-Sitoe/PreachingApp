import '@/lib/dayjs';
import './global.css';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
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

import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';

import { CustomDrawerContent } from '@/components/DrawerMenu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Colors from '@/constants/Colors';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependencies
  useEffect(() => {
    if (loaded) {
      autoSignIn();
    }
  }, [loaded]);

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

  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {__DEV__ && <DrizzleStudio />}
        <StatusBar animated translucent style="auto" />

        <Stack screenOptions={{ headerShown: false }}>
          <Drawer
            initialRouteName="(tabs)"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={() => ({
              headerShown: false,
              headerTintColor: isDark ? Colors.dark.text : Colors.light.text,
              headerStyle: {
                height: 85,
                borderBottomRightRadius: isDark ? 0 : 10,
                borderBottomLeftRadius: isDark ? 0 : 10,
                backgroundColor: isDark
                  ? Colors.dark.darkBgSecundary
                  : Colors.light.background,
              },
              title: '',
              drawerStyle: {
                width: 320,
              },
            })}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
