import { Link, Tabs } from 'expo-router'
import { Pressable, Text, useColorScheme } from 'react-native'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import ScrollIcon from '@/assets/icons/scroll.svg'

import Colors from '@/constants/Colors'
import { Icon } from '@/assets/icons/Icon'
import React from 'react'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 6,
        },
        tabBarStyle: {
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Relatório',
          tabBarIcon: ({ color }) => (
            <Icon name="pie-chart" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Estudantes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={27} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Anotações',

          tabBarIcon: ({ color }) => <ScrollIcon color={color} />,
        }}
      />
    </Tabs>
  )
}
