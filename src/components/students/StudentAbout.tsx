import TouchableOpacity, { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Pen, Trash2 } from 'lucide-react-native'
import { ScrollView } from 'react-native-gesture-handler'

export const StudentAbout = () => {
  const { isDark } = useTheme()
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        paddingBottom: 30,
      }}
    >
      <View className="flex-1 px-5 pt-5" lightColor="transparent">
        <Text
          className="text-base font-title uppercase"
          darkColor={Colors.dark.Success200}
          lightColor={Colors.light.tint}
        >
          Sobre
        </Text>
        <Text className="mt-1 mb-3 font-text">
          NativeBase ships with a default theme for each component. Check out
          the default theme of the textArea here .
        </Text>
        <Text
          className="text-base font-title "
          darkColor={Colors.dark.Success200}
          lightColor={Colors.light.tint}
        >
          Localizacao
        </Text>
        <Text className="mt-1  mb-3 font-text">Machava-sede</Text>
        <Text
          className="text-base font-title"
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.Success200}
        >
          Hora de visitar
        </Text>
        <Text className="mt-1  mb-3 font-text">
          Manha, tarde, final da tarfe
        </Text>

        <TouchableOpacity
          className="flex-row items-center gap-2 mt-6"
          lightColor="transparent"
          onPress={() => {}}
        >
          <View
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            className="w-9 h-9 justify-center items-center rounded"
          >
            <Pen color="white" />
          </View>

          <Text className="text-base">Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          lightColor="transparent"
          className="flex-row items-center gap-2 mt-6"
          onPress={() => {}}
        >
          <View className="bg-red-600 w-9 h-9 justify-center items-center rounded">
            <Trash2 color="white" />
          </View>

          <Text className="text-base">Apagar Pessoa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
