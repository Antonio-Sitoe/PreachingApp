import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { View } from '../Themed'
import { useReportsData } from '@/contexts/ReportContext'
import ReportsListAll from './components/ReportsListAll'
import ReportListWithButton from './components/ReportListWithButton'

export default function ReportsList() {
  const { isDark } = useTheme()
  const { isLayoutList } = useReportsData()

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      {isLayoutList ? <ReportsListAll /> : <ReportListWithButton />}
    </View>
  )
}
