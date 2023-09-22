import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import ReportMonths from '@/components/reports/ReportMonths'
import ReportYears from '@/components/reports/ReportYears'
import ReportsList from '@/components/reports/ReportsList'

import { View, useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useTabBarIndex } from '@/contexts/ReportContext'

const renderTabBar = (props, isDark) => {
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
  )
}
const renderScene = SceneMap({
  list: ReportsList,
  months: ReportMonths,
  years: ReportYears,
})
const routes = [
  { key: 'list', title: 'Relatórios' },
  { key: 'months', title: 'MÊS' },
  { key: 'years', title: 'ANOS' },
]

export default function Report() {
  const layout = useWindowDimensions()
  const { isDark } = useTheme()
  const { index, setIndex } = useTabBarIndex()

  return (
    <>
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
    </>
  )
}