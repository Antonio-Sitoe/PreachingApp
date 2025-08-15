import { Tabs } from 'expo-router';
import { IconIOS } from '@/assets/icons/Icon';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Header } from '@/components/Header';

import Colors from '@/constants/Colors';
import Note from '@/assets/icons/Note.svg';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        animated
        translucent
        style="light"
        backgroundColor={isDark ? Colors.dark.background : Colors.light.tint}
      />
      <Tabs
        screenOptions={{
          title: '',
          header() {
            return <Header />;
          },
          tabBarActiveTintColor: isDark ? Colors.dark.tint : Colors.light.tint,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 10,
          },
          headerBackgroundContainerStyle: {
            backgroundColor: isDark
              ? Colors.dark.darkBgSecundary
              : Colors.light.background,
          },
          tabBarStyle: {
            borderTopWidth: 0,
            borderWidth: 0,
            height: 70,
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
              <IconIOS name="home-outline" size={28} color={color} />
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
            title: 'Anotações',
            tabBarIcon: ({ color }) => <Note color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
