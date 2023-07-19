import { Drawer } from 'expo-router/drawer'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, withExpoSnack } from 'nativewind'
import { SplashScreen } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
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

function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
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
  const isDark = colorScheme === 'dark'
  return (
    <>
      <StatusBar animated translucent style="auto" />

      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerTintColor: isDark ? Colors.dark.text : Colors.light.text,
          headerStyle: {
            backgroundColor: isDark
              ? Colors.dark.darkBgSecundary
              : Colors.light.background,
          },
          title: '',
          drawerStyle: {
            width: 320,
          },
        }}
      />
    </>
  )
}

export default withExpoSnack(RootLayout)
