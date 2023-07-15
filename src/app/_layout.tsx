import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'

import { config } from '../../gluestack-ui.config'
import { useFonts } from 'expo-font'
import { Drawer } from 'expo-router/drawer'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SplashScreen, Link } from 'expo-router'
import { useColorScheme } from 'nativewind'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { View } from 'react-native'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
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

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-1 p-[24px] border h-[100%]">
        <View></View>
        <DrawerItem
          label="Website"
          onPress={() => props.navigation.closeDrawer()}
        />
        <Link href={'/alpha'} onPress={() => props.navigation.closeDrawer()}>
          Alpha
        </Link>
        <Link href={'/beta'} onPress={() => props.navigation.closeDrawer()}>
          Beta
        </Link>
        <Link href={'/charlie'} onPress={() => props.navigation.closeDrawer()}>
          Charlie
        </Link>
      </View>
    </DrawerContentScrollView>
  )
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

      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerLabel: 'Home', title: '' }}
        />
        <Drawer.Screen name="(stack)" />
        <Drawer.Screen name="modal" />
      </Drawer>
    </ThemeProvider>
  )
}
