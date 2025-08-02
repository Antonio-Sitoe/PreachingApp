import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { View } from '../Themed';
import { useReportsData } from '@/contexts/ReportContext';
import ReportsListAll from './components/ReportsListAll';
import ReportListWithButton from './components/ReportListWithButton';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsList() {
  const { isDark } = useTheme();
  const { isLayoutList, set } = useReportsData();

  // biome-ignore lint/correctness/useExhaustiveDependencies: isLayoutList is not used in the dependency array
  useEffect(() => {
    async function loadLayout() {
      try {
        const savedLayout = await AsyncStorage.getItem('@LayoutList');
        if (savedLayout !== null) {
          const isLayoutList = savedLayout === 'true';
          set({ isLayoutList });
        }
      } catch (error) {
        console.error('Erro ao carregar layout do AsyncStorage:', error);
      }
    }
    loadLayout();
  }, []);

  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1"
    >
      {isLayoutList ? <ReportsListAll /> : <ReportListWithButton />}
    </View>
  );
}
