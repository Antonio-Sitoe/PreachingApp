import {
  Clock3,
  YoutubeIcon,
  LibraryIcon,
  User2,
  ListRestartIcon,
} from 'lucide-react-native'

import Cards from '@/components/Cards'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import CreateReportModal from '@/components/CreateReportModal'
import { useReportsData } from '@/contexts/ReportContext'
import { useState } from 'react'
import { StopWatch } from '@/components/StopWatch'

import { AnimatedButton } from '@/components/ui/ButtonAnimated'
import { Text, View, ScrollView, Button } from 'react-native'
import { RESET_ALL_REPORT_DATA } from '@/database/actions/report/delete'

export default function TabOneScreen() {
  const { isDark } = useTheme()
  const { reports } = useReportsData()
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
          <Button title="clisas" onPress={RESET_ALL_REPORT_DATA} />
          <StopWatch />
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white"
          >
            Relatório do mês atual{' '}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards
              Icon={Clock3}
              content={reports.time ? reports.time : '0'}
              title="Horas"
            />
            <Cards Icon={YoutubeIcon} content={reports.videos} title="Videos" />
          </View>
          <View
            style={{ flex: 1, width: 'auto', marginTop: 16, marginBottom: 16 }}
          >
            <Cards
              Icon={LibraryIcon}
              content={reports.publications}
              title="Publicações"
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards Icon={User2} content={reports.students} title="ESTUDOS" />
            <Cards
              Icon={ListRestartIcon}
              content={reports.returnVisits}
              title="REVISITAS"
            />
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
