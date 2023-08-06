import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { View } from 'react-native'
import { usePathname } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  BarChart2,
  CalendarDays,
  List,
  Menu,
  Plus,
  RefreshCcw,
  Share2,
} from 'lucide-react-native'
import React, { useState } from 'react'
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router/src/useNavigation'

export function Header() {
  const top = useSafeAreaInsets().top
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const { index } = useTabBarIndex()
  const { setisOpenCreateReportModal } = useReportsData()
  const [isCalendar, setIsCalendary] = useState(false)
  const isReportPath = usePathname().includes('/report')

  function handleChangeMode() {
    setIsCalendary(!isCalendar)
  }

  return (
    <View className="w-screen" style={{ paddingTop: top }}>
      <View className="w-screen px-4 bg-white h-14 flex-row items-center justify-between ">
        <TouchableOpacity
          className="py-1"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Menu
            strokeWidth={1.5}
            color={isDark ? Colors.dark.text : Colors.light.tint}
            size={28}
          />
        </TouchableOpacity>
        <View className="flex-row gap-2 items-end">
          {isReportPath ? (
            <>
              {index === 0 && (
                <TouchableOpacity
                  className="px-2 py-1"
                  onPress={handleChangeMode}
                >
                  {isCalendar ? (
                    <List
                      color={isDark ? Colors.dark.text : Colors.light.tint}
                      size={28}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <CalendarDays
                      color={isDark ? Colors.dark.text : Colors.light.tint}
                      size={28}
                      strokeWidth={1.5}
                    />
                  )}
                </TouchableOpacity>
              )}
              {index === 1 && (
                <TouchableOpacity className="px-2 py-1">
                  <Share2
                    color={isDark ? Colors.dark.text : Colors.light.tint}
                    size={28}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              )}
              {index === 2 && (
                <TouchableOpacity className="py-1">
                  <BarChart2
                    color={isDark ? Colors.dark.text : Colors.light.tint}
                    size={28}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="py-1"
                onPress={() => setisOpenCreateReportModal(true)}
              >
                <Plus
                  color={isDark ? Colors.dark.text : Colors.light.tint}
                  size={28}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity className="py-1">
              <RefreshCcw
                color={isDark ? Colors.dark.text : Colors.light.tint}
                className="rotate-45"
                size={28}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
