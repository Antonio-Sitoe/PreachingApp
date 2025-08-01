import { useState } from 'react';
import { Text } from '@/components/Themed';
import dayjs from 'dayjs';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import Snackbar from 'react-native-snackbar';
import { currentDates, monthNameToPortuguese } from '@/utils/dates';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReportsData } from '@/contexts/ReportContext';
import { FormInput } from '@/components/ui/FormInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { View, TextInput, TouchableOpacity } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';

export function AddReportModal() {
  const { id, h, m } = useLocalSearchParams<any>();
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    updateCurrentReports,
    isOpenCreateReportModal,
    setisOpenCreateReportModal,
  } = useReportsData();

  const [hours, setHours] = useState<string | number>(h || '');
  const [minutes, setminutes] = useState<string | number>(m || '');
  const [students, setstudents] = useState<string | number>('');
  const [date, setDate] = useState(new Date());
  const [comments, setComents] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleChange = (setValue) => (value) => setValue(value);
  const InCHours = () => setHours(Number(hours) + 1);
  const decHours = () => setHours(Number(hours) > 1 ? Number(hours) - 1 : '');

  const handleChangeMinuts = (value: string) => {
    if (Number(value) >= 60) {
      return Number(value);
    } else {
      setminutes(Number(value));
    }
  };

  const InCMinutes = () =>
    setminutes(Number(minutes) >= 59 ? minutes : Number(minutes) + 1);
  const decMinutes = () =>
    setminutes(Number(minutes) > 1 ? Number(minutes) - 1 : '');

  const incStudents = () => setstudents(Number(students) + 1);
  const decStudents = () =>
    setstudents(Number(students) > 1 ? Number(students) - 1 : '');

  async function handleCreateReport() {
    try {
      setError(null);
      setIsLoading(true);
      const { data, isQualified } = formateDataBeforeSend();
      if (isQualified === false) {
        handleClose();
        return false;
      }
      // TODO: Implementar criação/atualização do relatório
      console.log('Dados do relatório:', data);
      await updateCurrentReports(currentDates.month, currentDates.year);
      Snackbar.show({
        text: 'Relatório Adicionado com Sucesso',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      });
      handleClose();
    } catch (error) {
      setError('Falha ao criar o relatório');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setisOpenCreateReportModal(false);
    router.back();
  }

  function formateDataBeforeSend() {
    const dateformated = dayjs(date).format('DD/MM/YYYY');
    const day = dayjs(date).get('date');
    const month = monthNameToPortuguese(dayjs(date).get('month') + 1);
    const year = dayjs(date).get('y');

    const data = {
      date: dateformated,
      day,
      month,
      year,
      comments,
      hours: Number(hours),
      minutes: Number(minutes),
      students: Number(students),
      createdAt: date,
    };
    const isQualified = simpleVerificationBeforeCreation(data);
    console.log('data to send', data);
    return { data, isQualified };
  }

  function simpleVerificationBeforeCreation(data: any) {
    if (
      data.hours === 0 &&
      data.minutes === 0 &&
      data.students === 0 &&
      data.comments.trim().length === 0
    ) {
      return false;
    } else return true;
  }
  return (
    <Modal isOpen={isOpenCreateReportModal} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent size="md">
        <ModalHeader>
          <Text className="text-lg font-bold">
            {id ? 'Editar Relatório' : 'Novo Relatório'}
          </Text>
          <ModalCloseButton onPress={handleClose} />
        </ModalHeader>

        <ModalBody>
          {/* DatePicker */}
          <DatePicker date={date} setDate={setDate} />

          {/* Horas e Minutos */}
          <View className="flex-row w-full mb-4">
            <FormInput
              value={hours}
              change={handleChange(setHours)}
              decrementValue={decHours}
              inCrementValue={InCHours}
              title="Horas"
            />
            <FormInput
              value={minutes}
              change={handleChangeMinuts}
              decrementValue={decMinutes}
              inCrementValue={InCMinutes}
              title="Minutos"
              style={{ marginLeft: 20 }}
            />
          </View>

          {/* Estudos */}
          <View className="w-full mb-4">
            <FormInput
              value={students}
              change={handleChange(setstudents)}
              decrementValue={decStudents}
              inCrementValue={incStudents}
              title="Estudos"
            />
          </View>

          {/* Comentários */}
          <View className="w-full mb-6">
            <Text className="text-base font-medium mb-2">Comentários</Text>
            <View
              className="w-full h-24 rounded-xl p-3"
              style={{
                backgroundColor: isDark
                  ? Colors.dark.darkBgSecundary
                  : Colors.light.ligtInputbG,
                borderWidth: 1,
                borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
              }}
            >
              <TextInput
                placeholder="Escreva aqui..."
                value={comments}
                onChangeText={setComents}
                numberOfLines={4}
                maxLength={140}
                multiline
                style={{
                  color: isDark ? Colors.dark.text : Colors.light.text,
                  fontFamily: 'IBMPLEX_Regular',
                  fontSize: 14,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={isDark ? '#666' : '#999'}
              />
            </View>
          </View>
        </ModalBody>

        <ModalFooter>
          <TouchableOpacity
            onPress={handleClose}
            className="flex-1 mr-2 py-3 px-4 rounded-lg"
            style={{
              backgroundColor: '#FF647C',
            }}
          >
            <Text
              lightColor="white"
              darkColor="white"
              className="text-white text-center font-medium"
            >
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreateReport}
            disabled={isLoading}
            className="flex-1 ml-2 py-3 px-4 rounded-lg"
            style={{
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text
              lightColor="white"
              darkColor="white"
              className="text-white text-center font-medium"
            >
              {isLoading ? 'Salvando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </ModalFooter>

        {error && (
          <Text className="mt-2 text-red-600 text-center">{error}</Text>
        )}
      </ModalContent>
    </Modal>
  );
}
