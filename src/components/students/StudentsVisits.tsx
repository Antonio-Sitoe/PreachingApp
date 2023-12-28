import { VisiteProps } from '@/@types/interfaces'
import TouchableOpacity, { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Divider } from '@react-native-material/core'
import { Pen, Trash2 } from 'lucide-react-native'
import { useState } from 'react'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const IRESULT = {
  attended: 'Esteve na visita',
  not_at_home: 'Não estava em casa',
  no_longer_interested: 'Já não está interessada',
  no_time: 'Não tinha tempo',
  called: 'Ligou por telefone',
}

interface IStudentsVisitsProps {
  data: VisiteProps[]
}
export const StudentsVisits = ({ data }: IStudentsVisitsProps) => {
  const { isDark } = useTheme()
  const [visits, setVisits] = useState(data || [])

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
          console.log(item)
          return (
            <View
              key={item.id}
              className="flex-1 pb-3 mt-5"
              lightColor="transparent"
            >
              <View
                className="flex-row items-center gap-2"
                lightColor="transparent"
              >
                <Text className="flex-1">
                  Domingo, 6 de abril de 2023 - 01:06
                  {item?.date_and_hours}
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
                  O que dizer na proxima visita ?
                </Text>
                <Text className="mt-1 mb-3 font-text">{item.notes}</Text>
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
                  <Text className="mt-1 mb-3 font-text">
                    {item.biblical_texts || '...'}
                  </Text>
                </View>
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Publicacoes
                  </Text>
                  <Text className="mt-1 mb-3 font-text">
                    {item?.publications || '...'}
                  </Text>
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
                  <Text className="mt-1 mb-3 font-text">
                    {item?.videos || '...'}
                  </Text>
                </View>
                <View lightColor="transparent">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Resultado
                  </Text>
                  <Text className="mt-1 mb-3 font-text">
                    {IRESULT[item.result]}
                  </Text>
                </View>
              </View>
              <Divider style={{ marginTop: 10 }} />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
