import TouchableOpacity, { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { type Student, studentsAction } from '@/database/actions';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

import { Pen, Trash2 } from 'lucide-react-native';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';

interface StudentAboutProps {
  data: Student;
}

export const StudentAbout = ({ data }: StudentAboutProps) => {
  const { isDark } = useTheme();
  const { push } = useRouter();

  const bestDay = data?.bestDay ? JSON.parse(data?.bestDay) : [];
  const bestTime = data?.bestTime ? JSON.parse(data?.bestTime) : [];

  function handleGoToEdit() {
    push({
      pathname: `/(drawer)/(tabs)/students/add-student`,
      params: {
        id: `${data?.id}`,
        about: `${data?.about}`,
        address: `${data?.address}`,
        age: data.age,
        bestDay: data.bestDay,
        bestTime: data.bestTime,
        email: data.email,
        gender: data.gender,
        name: data.name,
        telephone: data.telephone,
      },
    });
  }
  function handleDeleteStudent(id: string) {
    Alert.alert(
      `Tem certeza de que deseja excluir ${data?.name}?`,
      'Se eliminar, não poderá mais acessá-la.',
      [
        {
          text: 'Apagar',
          style: 'destructive',
          isPreferred: true,
          onPress: async () => {
            const { sucess } = await studentsAction.deleteWithOwnVisits(id);
            Snackbar.show({
              text: `${data?.name} apagado com sucesso`,
              duration: Snackbar.LENGTH_LONG,
            });
            if (sucess) {
              push('/(drawer)/(tabs)/students');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
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
          className="text-base font-title"
          darkColor={Colors.dark.Success200}
          lightColor={Colors.light.tint}
        >
          Sobre
        </Text>
        <Text className="mt-1 font-text mb-3">{data?.about}</Text>
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
          {bestDay.join(', ') || '...'}
        </Text>
        <Text
          className="text-base font-title"
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.Success200}
        >
          Hora de visitar
        </Text>
        <Text className="mt-1  mb-3 font-text">
          {bestTime.join(', ') || '...'}
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
          onPress={() => {
            if (data?.id) {
              handleDeleteStudent(data?.id as string);
            }
          }}
        >
          <View
            darkColor={Colors.dark.Error}
            lightColor={Colors.light.Error}
            className="w-9 h-9 justify-center items-center rounded-sm"
          >
            <Trash2 color="white" />
          </View>
          <Text className="font-text">Apagar {data?.name}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
