import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'

import { StyleSheet, Text, View } from 'react-native'
import { Route, useRouter } from 'expo-router'

import { IconIOS } from '@/assets/icons/Icon'
import { DRAWER_ROUTES } from '@/utils/routes'
import { useColorScheme } from 'nativewind'
import { Switch, TouchableOpacity } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import AvatarPerfil from './AvatarPerfil'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter()
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const { setItem } = useAsyncStorage('@THEME_KEY')

  const isDarkTheme = colorScheme === 'dark'

  const onChangeToggle = () => {
    toggleColorScheme()
    if (colorScheme === 'dark') setItem('light')
    else setItem('dark')
  }

  function handleGotoRoute(route: Route<string>) {
    router.push(route)
    props.navigation.closeDrawer()
  }

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: isDarkTheme ? Colors.dark.background : '#fefefe',
      }}
    >
      <AvatarPerfil
        isDarkTheme={isDarkTheme}
        closeDrawer={props.navigation.closeDrawer}
        route="/profile/"
      />
      <View className="w-full h-full pt-6 pr-6 pl-2">
        {DRAWER_ROUTES.map(({ icon, label, route }, index) => {
          const { IconRoute, name } = icon
          return (
            <DrawerItem
              key={index + label}
              label={label}
              activeBackgroundColor="blue"
              labelStyle={{
                fontSize: 16,
                paddingBottom: 5,
                color: isDarkTheme ? '#fefefe' : '#535763',
              }}
              style={{ width: '100%' }}
              icon={() => (
                <IconRoute
                  name={name}
                  strokeWidth={1.5}
                  size={28}
                  color={isDarkTheme ? Colors.dark.tint : '#535763'}
                />
              )}
              onPress={() => handleGotoRoute(route)}
            />
          )
        })}
        <View
          style={styles.themeContainer}
          className="flex flex-row items-center justify-between border-t-[0.3px] border-t-slate-600 pt-4 px-6 mt-3 w-full"
        >
          <View
            style={styles.icon}
            className="flex flex-row mt-1 items-center gap-5"
          >
            <IconIOS
              name="moon-outline"
              size={28}
              color={isDarkTheme ? Colors.dark.tint : '#535763'}
            />
            <Text
              className="text-[14.5px] font-subTitle"
              style={{ color: isDarkTheme ? 'white' : '#535763' }}
            >
              Modo Escuro
            </Text>
          </View>
          <TouchableOpacity
            style={styles.icon}
            className="flex flex-row items-center"
          >
            <Switch
              onChange={onChangeToggle}
              value={isDarkTheme}
              trackColor={{ true: Colors.dark.tint, false: Colors.light.tint }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  )
}

export const styles = StyleSheet.create({
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 24,
    paddingLeft: 24,
    borderTopColor: '#cbd5e1',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
