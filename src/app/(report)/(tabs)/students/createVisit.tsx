import { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { ScrollView } from 'react-native-gesture-handler'

export default function CreateVisit() {
  const { isDark } = useTheme()
  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center"
          lightColor="#F6F6F9"
        >
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over">
              Visita ao Morador (Antonio Manuel Sitoe)
            </Text>
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-11 h-1 rounded-lg mt-2"
            />
          </View>
        </View>
      </View>
      <View className="flex-1 pb-5 mt-5" lightColor="transparent">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
            paddingBottom: 60,
            paddingTop: 10,
          }}
        >
          <Text>ds</Text>
        </ScrollView>
      </View>
    </View>
  )
}
