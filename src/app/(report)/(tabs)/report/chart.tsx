import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ChevronLeft } from 'lucide-react-native'
import { Dimensions, View } from 'react-native'
import { useRouter } from 'expo-router'
import { LineChart } from 'react-native-chart-kit'
import { Text } from '@/components/Themed'
import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'
import { ListItem } from '@/components/reports/ReportMonths'

export default function Chart() {
  const { back } = useRouter()
  const { isDark } = useTheme()
  const [select, setSelect] = useState('')
  const screenWidth = Dimensions.get('window').width - 24
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [50, 20, 2, 86, 71, 100],
      },
    ],
  }
  const chartConfig = {
    backgroundGradientFrom: Colors.light.tint,
    backgroundGradientTo: Colors.light.tint,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => '#ffffff',
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffffff',
    },
  }
  const graphStyle = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    borderRadius: 16,
    boxShadow: 5,
  }
  return (
    <ScrollView>
      <View className="mt-4 px-4">
        <View className="flex-row justify-between items-center w-full">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={back}
            >
              <ChevronLeft
                size={45}
                color={isDark ? Colors.dark.tint : Colors.light.tint}
              />
            </TouchableOpacity>
            <Text className="text-base">Voltar</Text>
          </View>
          <View className="w-40 p-0 border-gray-200 border-b-[1px]">
            <Picker
              selectedValue={select}
              onValueChange={setSelect}
              style={{
                color: isDark ? 'white' : Colors.dark.background,
                padding: 0,
                margin: 0,
              }}
            >
              <Picker.Item label="Horas" value="publisher" />
              <Picker.Item label="Videos" value="baptized_publisher" />
              <Picker.Item label="Publicacoes" value="pioneer" />
              <Picker.Item label="Revisitas" value="pioneer" />
            </Picker>
          </View>
        </View>
      </View>
      <View className="w-full mt-3 items-center justify-center">
        <LineChart
          data={data}
          width={screenWidth}
          chartConfig={chartConfig}
          style={graphStyle}
          height={256}
          bezier
        />
        <View className="w-full mt-2">
          <Text className="text-lg font-bold px-4 font-text">
            Melhores Meses
          </Text>
          <View className="grid grid-cols-1 divide-y divide-slate-300">
            <ListItem title="Total de Horas" value="15" />
            <ListItem title="Publicacoes" value="32" />
            <ListItem title="Videos Mostrados" value="56" />
            <ListItem title="Revisitas" value="45" />
            <ListItem title="Estudos" value="45" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
