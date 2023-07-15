import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { LucideHome, ScrollText, User2, PieChart } from 'lucide-react-native'
import Colors from '@/constants/Colors'
import { IconIOS } from '@/assets/icons/Icon'
import Note from '@/assets/icons/Note.svg'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        title: '',
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 15,
        },
        tabBarStyle: {
          height: 85,
          paddingTop: 6,
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
  )
}
