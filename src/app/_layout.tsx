import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  BookOpenCheck,
  BadgeDollarSign,
  MessageSquarePlus,
  LucidePresentation,
  View,
} from 'lucide-react-native'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'

import { useFonts } from 'expo-font'
import { Drawer } from 'expo-router/drawer'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Route, SplashScreen, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import Animated from 'react-native-reanimated'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'

import { IconIOS } from '@/assets/icons/Icon'
import AvatarPerfil from '@/components/AvatarPerfil'
import { TouchableOpacity } from 'react-native'

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
  const router = useRouter()

  function handleGotoRoute(route: Route<string>) {
    router.push(route)
    // props.navigation.closeDrawer()
  }
  return (
    <DrawerContentScrollView {...props}>
      <AvatarPerfil
        closeDrawer={props.navigation.closeDrawer}
        route="/(drawer)/profile"
      />
      <Animated.View className="w-full h-full pt-6 pb-6 pr-6 pl-2">
        <DrawerItem
          label="Home"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <IconIOS name="ios-home-outline" size={28} color={'#535763'} />
          )}
          onPress={() => handleGotoRoute('/(tabs)')}
        />
        <DrawerItem
          label="Conversas sobre a Biblia"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <LucidePresentation strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/(drawer)/presentation')}
        />
        <DrawerItem
          label="Guia de Usuario"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <BookOpenCheck strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/drawer/userGuide/')}
        />
        <DrawerItem
          label="Ajuda e feedback"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <MessageSquarePlus strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/(drawer)/feedback')}
        />
        <DrawerItem
          label="Definicoes"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <IconIOS name="settings-outline" size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/(drawer)/settings')}
        />
        <DrawerItem
          label="Apoiar"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <BadgeDollarSign size={28} strokeWidth={1.5} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/drawer/helpUs')}
        />
      </Animated.View>
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

      <Drawer
        initialRouteName="(tabs)"
        screenOptions={{
          drawerStyle: {
            width: 320,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerLabel: 'Home', title: '' }}
        />
        <Drawer.Screen name="feedback" />
        <Drawer.Screen name="modal" />
      </Drawer>
    </ThemeProvider>
  )
}
