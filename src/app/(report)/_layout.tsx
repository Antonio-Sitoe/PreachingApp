import { Drawer } from 'expo-router/drawer'
import { useFonts } from 'expo-font'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { SplashScreen } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import '@/lib/dayjs'
import { Provider as MaterialProvider } from '@react-native-material/core'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter'

import { CustomDrawerContent } from '@/components/DrawerMenu'
import { useColorScheme } from 'nativewind'
import { ReportStorage } from '@/contexts/ReportContext'
import { UserStorage } from '@/contexts/UserContext'

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
    IBMPLEX_Regular: require('../../assets/fonts/IBMPlexSansCondensed-Regular.ttf'),
    IBMPLEX_Medium: require('../../assets/fonts/IBMPlexSansCondensed-Medium.ttf'),
    IBMPLEX_Bold: require('../../assets/fonts/IBMPlexSansCondensed-Bold.ttf'),
  })
  const { setColorScheme } = useColorScheme()
  const { getItem } = useAsyncStorage('@THEME_KEY')

  useEffect(() => {
    async function defineDefaultTheme() {
      const theme = await getItem()
      console.log('theme', theme === 'dark' ? 'dark' : 'light')
      setColorScheme(theme === 'dark' ? 'dark' : 'light')
    }
    defineDefaultTheme()
  }, [getItem, setColorScheme])

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
  const { isDark } = useTheme()

  return (
    <MaterialProvider>
      <UserStorage>
        <ReportStorage>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar animated translucent style="auto" />

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
          </GestureHandlerRootView>
        </ReportStorage>
      </UserStorage>
    </MaterialProvider>
  )
}
