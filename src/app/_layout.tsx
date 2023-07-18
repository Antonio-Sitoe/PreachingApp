import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'

import { Drawer } from 'expo-router/drawer'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { SplashScreen } from 'expo-router'

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter'

import { CustomDrawerContent } from '@/components/DrawerMenu'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_600SemiBold,
    IBMPLEX_Regular: require('../assets/fonts/IBMPlexSansCondensed-Regular.ttf'),
    IBMPLEX_Medium: require('../assets/fonts/IBMPlexSansCondensed-Medium.ttf'),
    IBMPLEX_Bold: require('../assets/fonts/IBMPlexSansCondensed-Bold.ttf'),
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        animated
        translucent
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />

      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          title: '',
          drawerStyle: {
            width: 320,
          },
        }}
      />
    </ThemeProvider>
  )
}
