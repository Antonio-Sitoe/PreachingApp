import type { IReport } from '@/database/actions';
import { Text, View, Modal, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const DialogReport = ({ visible, setVisible, reports }) => {
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <Modal visible={visible} onDismiss={() => setVisible(false)}>
      <View className="w-full flex-1 flex-row justify-between">
        <Text className="font-subTitle text-lg">Editar relatório</Text>
        {loading && <ActivityIndicator />}
      </View>

      <ScrollView
        style={{ maxHeight: 400 }}
        showsVerticalScrollIndicator={false}
      >
        {reports?.map((item: IReport, index: number) => {
          const date = dayjs(item.createdAt)
            .locale('pt-br')
            .format('dddd, D [de] MMMM [de] YYYY');
          return (
            <View key={index.toString()} className="p-3 pt-0 rounded mb-2">
              <TouchableOpacity
                className="mt-3"
                onPress={async () => {
                  setLoading(true);
                  setVisible(false);
                }}
              >
                <Text
                  style={{
                    backgroundColor: isDark
                      ? Colors.dark.Success200
                      : Colors.light.tint,
                    color: isDark ? '#252525' : 'white',
                  }}
                  darkColor="black"
                  className="p-1 px-2 mb-1 rounded-lg"
                >
                  {date}
                </Text>
                <Text className="ml-2">
                  {`${item.hours >= 10 ? item.hours : `0${item.hours}`}:${
                    item.minutes >= 10 ? item.minutes : `0${item.minutes}`
                  } horas, ${item.publications} publicações, ${
                    item.videos
                  } videos mostrados, ${item.returnVisits} revisitas, ${
                    item.students
                  } estudantes`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </Modal>
  );
};
