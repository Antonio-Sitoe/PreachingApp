import TouchableOpacity, { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Pen, Trash2 } from 'lucide-react-native'
import { useState } from 'react'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export const StudentsVisits = ({ data }) => {
  const { isDark } = useTheme()
  const [visits, setVists] = useState([1, 2, 3, 4, 5, 6])

  function handleDeleteVisit() {
    Alert.alert(
      'Tem certeza de que deseja excluir esta visita?',
      'Se eliminar, não poderá mais acessá-la.',
      [
        { text: 'Apagar', onPress: () => console.log('Botão 2 Pressionado') },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    )
  }

  return (
    <View className="flex-1 px-5 pt-2" lightColor="transparent">
      <Text
        className="text-base font-title uppercase pb-2"
        darkColor={Colors.dark.Success200}
        lightColor={Colors.light.tint}
      >
        VISITAS
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
        }}
      >
        {visits.map((item) => {
          return (
            <View
              key={item}
              className="flex-1 pb-3 mt-5 border-b-[1px] border-b-zinc-400"
              lightColor="transparent"
            >
              <View
                className="flex-row items-center gap-2"
                lightColor="transparent"
              >
                <Text className="flex-1">
                  Domingo, 6 de abril de 2023 - 01:06
                </Text>
                <View
                  className="flex-row items-center gap-2"
                  lightColor="transparent"
                >
                  <TouchableOpacity
                    lightColor={Colors.light.tint}
                    darkColor={Colors.dark.tint}
                    className="w-9 h-9 justify-center items-center rounded"
                    onPress={() => {}}
                  >
                    <Pen color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-600 w-9 h-9 justify-center items-center rounded"
                    onPress={() => handleDeleteVisit()}
                  >
                    <Trash2 color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View lightColor="transparent" className="mt-2">
                <Text
                  className="text-base font-title "
                  darkColor={Colors.dark.Success200}
                  lightColor={Colors.light.tint}
                >
                  Informacao da visita
                </Text>
                <Text className="mt-1 mb-3 font-text">
                  NativeBase ships with a default theme for each component.
                  Check out the default theme of the textArea here .
                </Text>
              </View>
              <View
                lightColor="transparent"
                className="flex-1 mt-2 flex-row items-start justify-between"
              >
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Textos lidos
                  </Text>
                  <Text className="mt-1 mb-3 font-text">Mateus 24:14</Text>
                </View>
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Publicacoes
                  </Text>
                  <Text className="mt-1 mb-3 font-text">Mateus 24:14</Text>
                </View>
              </View>
              <View
                lightColor="transparent"
                className="flex-1 mt-2 flex-row items-start justify-between"
              >
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Videos Mostrados
                  </Text>
                  <Text className="mt-1 mb-3 font-text">Mateus 24:14</Text>
                </View>
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Resultado
                  </Text>
                  <Text className="mt-1 mb-3 font-text">Mateus 24:14</Text>
                </View>
              </View>
              <View lightColor="transparent" className="mt-2">
                <Text
                  className="text-base font-title "
                  darkColor={Colors.dark.Success200}
                  lightColor={Colors.light.tint}
                >
                  O que dizer da proxima vez:
                </Text>
                <Text className="mt-1 mb-3 font-text">
                  NativeBase ships with a default theme for each component.
                  Check out the default theme of the textArea here .
                </Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
