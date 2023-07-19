import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'

import React from 'react'

import { Text, View } from 'react-native'
import { Route, useRouter } from 'expo-router'
import { AnimatedSwitchButton } from './ui/AnimatedSwitchButton'

import AvatarPerfil from './AvatarPerfil'
import { DRAWER_ROUTES } from '@/utils/routes'
import { IconIOS } from '@/assets/icons/Icon'
import { useColorScheme } from 'nativewind'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const isDarkTheme = colorScheme === 'dark'

  function handleGotoRoute(route: Route<string>) {
    router.push(route)
    props.navigation.closeDrawer()
  }

  return (
    <DrawerContentScrollView {...props}>
      <AvatarPerfil
        closeDrawer={props.navigation.closeDrawer}
        route="/profile/"
      />
      <View className="w-full h-full pt-6 pb-6 pr-6 pl-2 dark:bg-black">
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

        <View className="mt-5  px-6 border-t border-t-slate-300">
          <View className="pt-4 flex flex-row items-center gap-2 w-full mb-2">
            <IconIOS name="color-palette-outline" size={24} color="#535763" />
            <Text className="text-black dark:text-white">Tema</Text>
          </View>
          <AnimatedSwitchButton />
        </View>
      </View>
    </DrawerContentScrollView>
  )
}
