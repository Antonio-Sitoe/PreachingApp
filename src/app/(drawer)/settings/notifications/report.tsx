import { useState } from 'react';
import { useWindowDimensions, TouchableOpacity } from 'react-native';
import { NotificationStatusCard } from '@/components/reports/notifications/NotificationStatusCard';
import { NotificationSettingsCard } from '@/components/reports/notifications/NotificationSettingsCard';
import { AnalyticsCard } from '@/components/reports/notifications/AnalyticsCard';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { View, Text } from '@/components/Themed';
import { BackButton } from '@/components/ui/BackButton';

import { TabView, SceneMap, type TabBarProps } from 'react-native-tab-view';

const renderTabBar = (
  props: TabBarProps<{ key: string; title: string }>,
  isDark: boolean
) => {
  return (
    <View className="px-3 pb-3">
      <View
        className="rounded-lg pb-1"
        style={{
          backgroundColor: isDark ? Colors.dark.background : Colors.light.tint,
          borderColor: isDark ? Colors.dark.tint : '',
          borderWidth: isDark ? 2 : 0,
        }}
      >
        <View className="flex-row rounded-lg">
          {props.navigationState.routes.map((route, index) => {
            const isFocused = props.navigationState.index === index;
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.jumpTo(route.key)}
                className="flex-1 items-center justify-center py-2"
                style={{
                  minHeight: 40,
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    left: 3,
                    right: 3,
                    height: 2,
                    backgroundColor: isFocused ? 'white' : 'transparent',
                    borderRadius: 8,
                  }}
                />
                <Text
                  className="text-center"
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: isFocused ? 'white' : Colors.dark.Success200,
                  }}
                >
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
const renderScene = SceneMap({
  settings: NotificationSettingsCard,
  status: NotificationStatusCard,
  analytics: AnalyticsCard,
});
const routes = [
  { key: 'settings', title: 'Configurações' },
  { key: 'status', title: 'Estado' },
  { key: 'analytics', title: 'Estatísticas' },
];

export default function MonthlyReportsSettingsScreen() {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const { isDark } = useTheme();

  return (
    <View
      className="flex-1"
      lightColor={Colors.light.background}
      darkColor={Colors.dark.background}
    >
      <View className="flex-row items-center mt-4 mb-4">
        <BackButton />
        <Text
          className="text-2xl font-bold"
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
        >
          Notificações
        </Text>
      </View>

      <TabView
        renderTabBar={(props) => renderTabBar(props, isDark)}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
}
