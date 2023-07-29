import {
  Clock3,
  YoutubeIcon,
  LibraryIcon,
  User2,
  ListRestartIcon,
} from 'lucide-react-native'
import { StopWatch } from '@/components/StopWatch'
import { Text, View, ScrollView, Button } from 'react-native'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Cards from '@/components/Cards'
import CreateReportModal from '@/components/CreateReportModal'

import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/ButtonAnimated'

export default function TabOneScreen() {
  const { isDark } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)

  function handleAddReport() {
    setModalVisible(true)
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 80,
        }}
      >
        <View className="flex-1 pt-8 px-4" style={{ flex: 1 }}>
          <StopWatch />
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white"
          >
            Relatório do mês atual{' '}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards Icon={Clock3} content="6:00" title="Horas" />
            <Cards Icon={YoutubeIcon} content="2" title="Videos" />
          </View>
          <View
            style={{ flex: 1, width: 'auto', marginTop: 16, marginBottom: 16 }}
          >
            <Cards Icon={LibraryIcon} content="2" title="Publicações" />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards Icon={User2} content="2" title="ESTUDOS" />
            <Cards Icon={ListRestartIcon} content="2" title="REVISITAS" />
          </View>
        </View>
      </ScrollView>
      <AnimatedButton onPress={handleAddReport} />
      <CreateReportModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  )
}
