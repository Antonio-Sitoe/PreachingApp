import TouchableOpacity, { Text, View } from '@/components/Themed';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { studentsAction } from '@/database/actions';
import type { Student } from '@/database/schemas';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { Calendar, Pen, Trash2 } from 'lucide-react-native';
import Snackbar from 'react-native-snackbar';

interface StudentAboutProps {
  data: Student;
}

export const StudentAbout = ({ data }: StudentAboutProps) => {
  const { isDark } = useTheme();
  const { push } = useRouter();

  function handleGoToEdit() {
    push({
      pathname: `/(drawer)/(tabs)/students/add-student`,
      params: {
        id: `${data?.id}`,
        about: `${data?.about}`,
        address: `${data?.address}`,
        age: data.age,
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
            try {
              const { sucess } = await studentsAction.deleteWithOwnVisits(id);
              if (sucess) {
                Snackbar.show({
                  text: `${data?.name} apagado com sucesso`,
                  duration: Snackbar.LENGTH_LONG,
                });
                push('/(drawer)/(tabs)/students');
              }
            } catch (error) {
              console.error('Erro ao deletar estudante:', error);
              Snackbar.show({
                text: 'Erro ao deletar estudante',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }

  function handleGoToAvailability() {
    push({
      pathname: '/(drawer)/(tabs)/students/add-student/availability',
      params: { data: JSON.stringify(data) },
    });
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

        <TouchableOpacity
          className="flex-row items-center gap-2 mt-6"
          lightColor="transparent"
          onPress={handleGoToAvailability}
        >
          <View
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            className="w-9 h-9 justify-center items-center rounded"
          >
            <Calendar color="white" />
          </View>

          <Text className="font-text font-text">
            Adicionar/Editar Disponibilidade
          </Text>
        </TouchableOpacity>
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
