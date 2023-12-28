import { IStudentsBody } from '@/@types/interfaces'
import TouchableOpacity, { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { useRouter } from 'expo-router'

import { Pen, Trash2 } from 'lucide-react-native'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

interface StudentAboutProps {
  data: IStudentsBody
}

export const StudentAbout = ({ data }: StudentAboutProps) => {
  const { isDark } = useTheme()
  const { push } = useRouter()

  function handleGoToEdit() {
    push({
      pathname: `/(report)/(tabs)/students/createStudents`,
      params: {
        id: `${data?.id}`,
        about: `${data?.about}`,
        address: `${data?.address}`,
        age: data.age,
        best_day: JSON.stringify(data.best_day),
        best_time: JSON.stringify(data.best_time),
        email: data.email,
        gender: data.gender,
        name: data.name,
        telephone: data.telephone,
      },
    })
  }
  function handleDeleteStudent() {
    Alert.alert(
      `Tem certeza de que deseja excluir ${data?.name}?`,
      'Se eliminar, não poderá mais acessá-la.',
      [
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => console.log('Botão 2 Pressionado'),
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        paddingBottom: 70,
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
        <Text className="mt-1 mb-3 font-text">{data?.about}</Text>
        <Text
          className="text-base font-title "
          darkColor={Colors.dark.Success200}
          lightColor={Colors.light.tint}
        >
          Localizacao
        </Text>
        <Text className="mt-1  mb-3 font-text">{data?.address || '...'}</Text>
        <Text
          className="text-base font-title"
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.Success200}
        >
          Dia de visitar
        </Text>
        <Text className="mt-1  mb-3 font-text">
          {data.best_day.join(', ') || '...'}
        </Text>
        <Text
          className="text-base font-title"
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.Success200}
        >
          Hora de visitar
        </Text>
        <Text className="mt-1  mb-3 font-text">
          {data.best_time.join(', ') || '...'}
        </Text>

        <TouchableOpacity
          className="flex-row items-center gap-2 mt-6"
          lightColor="transparent"
          onPress={handleGoToEdit}
        >
          <View
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            className="w-9 h-9 justify-center items-center rounded"
          >
            <Pen color="white" />
          </View>

          <Text className="font-text">Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          lightColor="transparent"
          className="flex-row items-center gap-2 mt-6"
          onPress={handleDeleteStudent}
        >
          <View className="bg-red-600 w-9 h-9 justify-center items-center rounded">
            <Trash2 color="white" />
          </View>
          <Text className="font-text">Apagar Pessoa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
