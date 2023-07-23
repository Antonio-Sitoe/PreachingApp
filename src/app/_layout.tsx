import { Drawer } from 'expo-router/drawer'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { withExpoSnack, NativeWindStyleSheet } from 'nativewind'
import { SplashScreen } from 'expo-router'

import '@/lib/dayjs'

import Colors from '@/constants/Colors'

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter'

import { CustomDrawerContent } from '@/components/DrawerMenu'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Menu, RefreshCcw } from 'lucide-react-native'
import useTheme from '@/hooks/useTheme'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

NativeWindStyleSheet.setOutput({
  default: 'native',
})

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
  const { isDark } = useTheme()

  return (
    <>
      <StatusBar animated translucent style="auto" />
      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={(props) => ({
          headerRightContainerStyle: {
            paddingRight: 20,
          },
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
          headerLeft() {
            return (
              <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Menu
                  strokeWidth={1.5}
                  color={isDark ? Colors.dark.text : Colors.light.tint}
                  size={28}
                />
              </TouchableOpacity>
            )
          },
          headerRight: () => (
            <TouchableOpacity>
              <RefreshCcw
                color={isDark ? Colors.dark.text : Colors.light.tint}
                className="rotate-45"
                size={28}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          ),
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
    </>
  )
}

export default withExpoSnack(RootLayout)
