import { useState } from 'react';
import { Text } from '@/components/Themed';
import dayjs from 'dayjs';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import Snackbar from 'react-native-snackbar';
import { currentDates } from '@/utils/dates';
import { useReportsData } from '@/contexts/ReportContext';
import { FormInput } from '@/components/ui/FormInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { type NewReport, reportsActions } from '@/database/actions';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react-native';
import { removeProperty } from '@/utils/helper';

export function AddReportModal() {
  const { isOpenCreateReportModal } = useReportsData();
  const isOpen = isOpenCreateReportModal;
  if (!isOpen) return null;
  return <CreateAndEditReportModal isOpen={isOpen} />;
}

function CreateAndEditReportModal({ isOpen }: { isOpen: boolean }) {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const { setisOpenCreateReportModal, reports, reset } = useReportsData();

  const {
    id,
    hours: h,
    minutes: m,
    students: s,
    comments: c,
    date: d,
  } = reports;

  const [hours, setHours] = useState<string | number>(h || '');
  const [minutes, setminutes] = useState<string | number>(m || '');
  const [students, setstudents] = useState<string | number>(s || '');
  const [date, setDate] = useState(() => {
    if (d) {
      return new Date(d);
    }
    return new Date();
  });
  const [comments, setComents] = useState(c || '');
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

      if (id) {
        const updatedReport = await reportsActions.update(
          id,
          removeProperty(data, ['createdAt'])
        );
        console.log('updatedReport', updatedReport);
      } else {
        const createdReport = await reportsActions.create(data);
        console.log('createdReport', createdReport);
      }
      console.log('Dados do relatório:', data);
      ['reports', 'all', 'grouped', 'paginated', 'withButton'].forEach(
        (item) => {
          queryClient.invalidateQueries({
            queryKey: [item],
          });
        }
      );
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
    reset();
    setisOpenCreateReportModal(false);
  }

  function formateDataBeforeSend() {
    const day = dayjs(date).get('date');
    const month = dayjs(date).get('month') + 1; // Número do mês (1-12)
    const year = dayjs(date).get('y');

    const data: NewReport = {
      date: String(dayjs(date)),
      day,
      month: month,
      year,
      comments,
      hours: Number(hours),
      minutes: Number(minutes),
      students: Number(students),
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
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

  async function handleDeleteReport() {
    if (!id) return;
    Alert.alert(
      'Tem certeza que deseja deletar o relatório?',
      'Esta ação é irreversível',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            await reportsActions.delete(id);
            handleClose();
            ['reports', 'all', 'grouped', 'paginated', 'withButton'].forEach(
              (item) => {
                queryClient.invalidateQueries({
                  queryKey: [item],
                });
              }
            );
            Snackbar.show({
              text: 'Relatório Deletado com Sucesso',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            });
          },
        },
      ]
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent size="md">
        <ModalHeader>
          <Text className="text-lg font-bold">
            {id ? 'Editar Relatório' : 'Novo Relatório'}
          </Text>
          <ModalCloseButton onPress={handleClose} />
        </ModalHeader>

        <ModalBody>
          <DatePicker date={date} setDate={setDate} />

          <View className="flex-row w-full mb-2">
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
          <View className="w-full mb-2">
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

        <ModalFooter className="flex-row gap-2 justify-around">
          {id && (
            <TouchableOpacity
              onPress={handleDeleteReport}
              className="p-2 rounded-lg "
              style={{
                backgroundColor: 'red',
              }}
            >
              <Trash2 color="white" size={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleClose}
            className="flex-1 py-3 px-4 rounded-lg"
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
