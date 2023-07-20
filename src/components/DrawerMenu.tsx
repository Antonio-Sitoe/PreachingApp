import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'

import { Text, View } from 'react-native'
import { Route, useRouter } from 'expo-router'

import { IconIOS } from '@/assets/icons/Icon'
import { DRAWER_ROUTES } from '@/utils/routes'
import { useColorScheme } from 'nativewind'
import { Switch, TouchableOpacity } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import AvatarPerfil from './AvatarPerfil'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter()
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const isDarkTheme = colorScheme === 'dark'

  const onChangeToggle = () => {
    toggleColorScheme()
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
                  color={isDarkTheme ? '#6979F8' : '#535763'}
                />
              )}
              onPress={() => handleGotoRoute(route)}
            />
          )
        })}
        <View className="flex flex-row items-center justify-between px-6 border-t-[1px] border-t-slate-300 mt-5 w-full">
          <View className="flex flex-row  items-center gap-2">
            <IconIOS
              name="color-palette-outline"
              size={24}
              color={isDarkTheme ? '#6979F8' : '#535763'}
            />
            <Text className="text-black dark:text-white">Tema</Text>
          </View>
          <TouchableOpacity className="flex flex-row items-center">
            <Text className="text-black dark:text-white">
              {isDarkTheme ? 'Escuro' : 'Claro'}{' '}
            </Text>
            <Switch onChange={onChangeToggle} value={isDarkTheme} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  )
}
