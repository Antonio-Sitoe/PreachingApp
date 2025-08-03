import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { NotificationStatusCard } from '@/components/reports/notifications/NotificationStatusCard';
import { NotificationSettingsCard } from '@/components/reports/notifications/NotificationSettingsCard';
import { AnalyticsCard } from '@/components/reports/notifications/AnalyticsCard';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { View, Text } from '@/components/Themed';
import { BackButton } from '@/components/ui/BackButton';

import {
  TabView,
  SceneMap,
  TabBar,
  type TabBarProps,
} from 'react-native-tab-view';
import { NotificationInformation } from '@/components/reports/notifications/NotificationInformation';

const renderTabBar = (
  props: TabBarProps<{ key: string; title: string }>,
  isDark: boolean
) => {
  return (
    <View className="px-3 pb-3">
      <TabBar
        {...props}
        inactiveColor={Colors.dark.Success200}
        indicatorStyle={{
          backgroundColor: 'white',
          marginBottom: 3,
          paddingBottom: 3,
          borderRadius: 8,
          marginLeft: 3,
          width: '30%',
        }}
        style={{
          borderRadius: 6,
          paddingBottom: 3,
          backgroundColor: isDark ? Colors.dark.background : Colors.light.tint,
          borderColor: isDark ? Colors.dark.tint : '',
          borderWidth: isDark ? 2 : 0,
        }}
      />
    </View>
  );
};
const renderScene = SceneMap({
  status: NotificationStatusCard,
  settings: NotificationSettingsCard,
  analytics: AnalyticsCard,
  information: NotificationInformation,
});
const routes = [
  { key: 'status', title: 'Estado' },
  { key: 'settings', title: 'Configurações' },
  { key: 'analytics', title: 'Outras Notificações' },
  { key: 'information', title: 'Informações' },
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
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.tint}
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
        style={{
          backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
        }}
      />
    </View>
  );
}
