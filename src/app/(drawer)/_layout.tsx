import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'

import { CustomDrawerContent } from '@/components/DrawerMenu'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

export default function RootLayout() {
  const { isDark } = useTheme()

  return (
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
  )
}
