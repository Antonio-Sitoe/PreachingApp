import { Text, View } from '@/components/Themed'
import { AnimatedButtonWithText } from '@/components/ui/ButtonAnimatedV2'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Person from '@/assets/images/Person.svg'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useTabBarIndex } from '@/contexts/ReportContext'
import { StudentAbout } from '@/components/students/StudentAbout'
import { StudentsVisits } from '@/components/students/StudentsVisits'

const renderTabBar = (props: any, isDark: boolean) => {
  return (
    <View className="px-3 pb-3" lightColor="transparent">
      <TabBar
        {...props}
        inactiveColor={Colors.dark.Success200}
        indicatorStyle={{
          backgroundColor: !isDark ? '#3531C2' : '#2F6846',
          marginBottom: 3,
          paddingBottom: 3,
          borderRadius: 8,
          marginLeft: 3,
          width: '50%',
          height: '89%',
        }}
        style={{
          borderRadius: 6,
          paddingBottom: 3,
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
        }}
      />
    </View>
  )
}
const renderScene = SceneMap({
  about: StudentAbout,
  visits: StudentsVisits,
})
const routes = [
  { key: 'about', title: 'SOBRE' },
  { key: 'visits', title: 'VISITAS' },
]

export default function Profile() {
  const router = useRouter()
  const { isDark } = useTheme()
  const layout = useWindowDimensions()
  const { index, setIndex } = useTabBarIndex()
  const [visits, setVisits] = useState([1, 2, 3, 4, 5])

  function handleAddVisit() {}
  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center"
          lightColor="#F6F6F9"
        >
          <View
            darkColor="#FBEEBC"
            className="w-20 h-20 mr-6 rounded-2xl flex items-center justify-center relative"
          >
            <Person width={60} height={60} />
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-10 h-7 items-center justify-center rounded-lg absolute bottom-[-5px] right-[-10px]"
            >
              <Text lightColor="#FBEEBC">+50</Text>
            </View>
          </View>
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over">
              Antonio Manuel Sitoe Antonio Manuel Sitoe
            </Text>
            <Text>878984953</Text>
            <Text>antoniositoe@gmail.com</Text>
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-11 h-1 rounded-lg mt-2"
            />
          </View>
        </View>
      </View>
      <View className="flex-1 pb-5 mt-5" lightColor="transparent">
        <TabView
          renderTabBar={(props) => renderTabBar(props, isDark)}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </View>
      <AnimatedButtonWithText
        text="Adicionar Visita"
        onPress={handleAddVisit}
      />
    </View>
  )
}
