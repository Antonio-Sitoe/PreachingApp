import { Tabs } from 'expo-router'
import { useColorScheme, View, Text } from 'react-native'
import { LucideHome, ScrollText, User2, PieChart } from 'lucide-react-native'
import Colors from '@/constants/Colors'

const TabBarTitle = ({ title, isActive }) => {
  return (
    <View>
      <Text
        style={{
          color: isActive ? '#6979F8' : 'black',
        }}
        className="text-[12px] text-inherit"
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: isActive ? '#6979F8' : 'transparent',
        }}
        className="w-30 mt-2 h-1 rounded-full"
      />
    </View>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -15,
        },

        tabBarStyle: {
          height: 90,
          borderWidth: 1,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <TabBarTitle title="Home" isActive={focused} />
          ),
          tabBarIcon: ({ color }) => <LucideHome size={27} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Relatório',
          tabBarLabel: ({ focused }) => (
            <TabBarTitle title="Relatório" isActive={focused} />
          ),
          tabBarIcon: ({ color }) => <PieChart size={27} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          // title: '',
          tabBarLabel: ({ focused }) => (
            <TabBarTitle title="Estudantes" isActive={focused} />
          ),
          tabBarIcon: ({ color }) => <User2 color={color} size={27} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarTitle title="Anotacoes" isActive={focused} />
          ),
          tabBarIcon: ({ color }) => <ScrollText color={color} size={27} />,
        }}
      />
    </Tabs>
  )
}
