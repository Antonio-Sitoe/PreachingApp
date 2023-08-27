import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import * as Sharing from 'expo-sharing'

import { View, Share } from 'react-native'
import { usePathname } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BarChart2, Menu, Plus, RefreshCcw, Share2 } from 'lucide-react-native'
import { useReportsData, useTabBarIndex } from '@/contexts/ReportContext'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router/src/useNavigation'

export function Header() {
  const top = useSafeAreaInsets().top
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const { index } = useTabBarIndex()
  const { setisOpenCreateReportModal, reportToShare } = useReportsData()
  const isReportPath = usePathname().includes('/report')

  async function handleShareReport() {
    try {
      await Share.share({
        message: reportToShare,
        url: '',
        title: 'Relatório do Mes Actual',
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View
      className="w-screen"
      style={{
        paddingTop: top,
        backgroundColor: isDark
          ? Colors.dark.darkBgSecundary
          : Colors.light.background,
      }}
    >
      <View className="w-screen px-4 h-14 flex-row items-center justify-between ">
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
              {index === 1 && (
                <TouchableOpacity
                  className="px-2 py-1"
                  onPress={handleShareReport}
                >
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
