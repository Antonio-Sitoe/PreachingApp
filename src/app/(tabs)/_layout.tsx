import { Tabs } from 'expo-router'
import { IconIOS } from '@/assets/icons/Icon'
import { useColorScheme } from 'nativewind'

import Colors from '@/constants/Colors'
import Note from '@/assets/icons/Note.svg'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <>
      <StatusBar animated translucent style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          title: '',
          tabBarActiveTintColor: Colors.light.tint,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 15,
          },
          headerBackgroundContainerStyle: {
            backgroundColor: isDark
              ? Colors.dark.darkBgSecundary
              : Colors.light.background,
          },
          headerRight: () => {
            return <Text>Hello</Text>
          },

          tabBarStyle: {
            borderTopWidth: 0,
            borderWidth: 0,
            height: 85,
            paddingTop: 6,
            backgroundColor: isDark
              ? Colors.dark.darkBgSecundary
              : Colors.light.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconIOS name="ios-home-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: 'Relatório',
            tabBarIcon: ({ color }) => (
              <IconIOS name="pie-chart-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="students"
          options={{
            title: 'Estudantes',
            tabBarIcon: ({ color }) => (
              <IconIOS name="person-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Anotacoes',
            tabBarIcon: ({ color }) => <Note color={color} />,
          }}
        />
      </Tabs>
    </>
  )
}
