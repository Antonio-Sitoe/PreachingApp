import TouchableOpacity, { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import dayjs from 'dayjs';

import { capitalizeString } from '@/utils/helper';
import { ActivityIndicator, Alert } from 'react-native';
import { Pen, Trash2 } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { type IVisit, visitsAction } from '@/database/actions';
import NoContent from '../NoContent';

const IRESULT = {
  attended: 'Esteve na visita',
  not_at_home: 'Não estava em casa',
  no_longer_interested: 'Já não está interessada',
  no_time: 'Não tinha tempo',
  called: 'Ligou por telefone',
};

function formateDate(date: string) {
  const parsedDate = dayjs(
    new Date(date.split('/').reverse().join('-')),
    'DD/MM/YYYY'
  ).format('dddd, D [de] MMMM [de] YYYY');
  return capitalizeString(parsedDate);
}

interface IStudentsVisitsProps {
  visits: IVisit[];
  handleAddVisit(id: string): void;
  load: boolean;
  reset(): void;
}
export const StudentsVisits = ({
  visits,
  load,
  handleAddVisit,
  reset,
}: IStudentsVisitsProps) => {
  const { isDark } = useTheme();

  function handleDeleteVisit(id: string) {
    Alert.alert(
      'Tem certeza de que deseja excluir esta visita?',
      'Se eliminar, não poderá mais acessá-la.',
      [
        {
          text: 'Apagar',
          onPress: async () => {
            await visitsAction.deleteVisitById(id);
            reset();
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }

  return (
    <View className="flex-1 px-5 pt-2" lightColor="transparent">
      <Text
        className="text-base font-title uppercase pb-2"
        darkColor={Colors.dark.Success200}
        lightColor={Colors.light.tint}
      >
        VISITAS ({visits.length})
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
        }}
      >
        {load && (
          <ActivityIndicator
            color={isDark ? Colors.dark.tint : Colors.light.tint}
          />
        )}
        {visits.length === 0 && (
          <View className="mt-10">
            <NoContent text="Sem visitas" />
          </View>
        )}
        {visits.map((item) => {
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
                  {item?.dateAndHours ? formateDate(item?.dateAndHours) : '...'}
                </Text>
                <View
                  className="flex-row items-center gap-2"
                  lightColor="transparent"
                >
                  <TouchableOpacity
                    lightColor={Colors.light.tint}
                    darkColor={Colors.dark.tint}
                    className="w-9 h-9 justify-center items-center rounded"
                    onPress={() => handleAddVisit(item.id)}
                  >
                    <Pen color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    lightColor={Colors.light.Error}
                    darkColor={Colors.dark.Error}
                    className="w-9 h-9 justify-center items-center rounded"
                    onPress={() => handleDeleteVisit(item.id)}
                  >
                    <Trash2 color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View lightColor="transparent" className="mt-3">
                <Text
                  className="text-base font-title "
                  darkColor={Colors.dark.Success200}
                  lightColor={Colors.light.tint}
                >
                  O que dizer na proxima visita ?
                </Text>
                <Text className="mt-1 mb-3 font-text">
                  {item.notes || '...'}
                </Text>
              </View>
              <View
                lightColor="transparent"
                className="flex-1 mt-2 gap-2 flex-row items-start justify-between"
              >
                <View lightColor="transparent" className="flex-1">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Textos lidos
                  </Text>
                  <Text className="mt-1 mb-3 font-text">
                    {item.biblicalTexts || '...'}
                  </Text>
                </View>
                <View lightColor="transparent" className="flex-1">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Publicações
                  </Text>
                  <Text className="mt-1 mb-3 font-text">
                    {item?.publications || '...'}
                  </Text>
                </View>
              </View>
              <View
                lightColor="transparent"
                className="flex-1 mt-2 gap-2 flex-row items-start justify-between"
              >
                <View lightColor="transparent" className="flex-1">
                  <Text
                    className="text-base font-title "
                    darkColor={Colors.dark.Success200}
                    lightColor={Colors.light.tint}
                  >
                    Resultado
                  </Text>
                  <Text className="mt-1 mb-3 font-text">
                    {IRESULT[item.result as keyof typeof IRESULT] || '...'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: '#ccc',
                  marginVertical: 8,
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
