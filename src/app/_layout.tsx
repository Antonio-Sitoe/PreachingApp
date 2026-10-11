import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import '@/app/global.css';

import { DrizzleStudio } from '@/components/drizzle-studio';
import { ToastHost } from '@/components/ui/toast';
import { FONTS } from '@/lib/fonts';
import { NotificationProvider } from '@/contexts/notification-provider';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding';
import { NAV_THEME } from '@/lib/theme';
import { db } from '@/database/db';
import migrations from '@/database/migrations/migrations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Redirect, SplashScreen, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { success: migrationsApplied, error: migrationError } = useMigrations(db, migrations);
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    if (migrationError) throw migrationError;
  }, [migrationError]);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  const ready = migrationsApplied && fontsLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <OnboardingProvider>
            <NotificationProvider>
              {__DEV__ && <DrizzleStudio />}
              <RootNavigator colorScheme={colorScheme} />
              <ToastHost />
              <PortalHost />
            </NotificationProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator({ colorScheme }: { colorScheme: 'light' | 'dark' | undefined }) {
  const { completed } = useOnboarding();

  return (
    <>
      <StatusBar style={!completed || colorScheme !== 'dark' ? 'dark' : 'light'} />
      <OnboardingRedirect />
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 20 },
          headerShadowVisible: false,
        }}>
        <Stack.Protected guard={!completed}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={completed}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        {/* A conta abre-se tanto na primeira abertura como depois, a partir do app. */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

function OnboardingRedirect() {
  const { completed } = useOnboarding();
  const pathname = usePathname();

  // A primeira abertura tem vários ecrãs: /welcome, /welcome/setup, /welcome/permissions...
  const onWelcome = pathname === '/welcome' || pathname.startsWith('/welcome/');
  // Os ecrãs de conta (/auth/...) abrem-se antes e depois da primeira abertura.
  const onAuth = pathname.startsWith('/auth/');

  if (!completed && !onWelcome && !onAuth) {
    return <Redirect href="/welcome" />;
  }
  if (completed && onWelcome) {
    return <Redirect href="/" />;
  }
  return null;
}
