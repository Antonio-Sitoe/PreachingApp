import TouchableOpacity, { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackButton } from '@/components/ui/BackButton';
import {
  type Student,
  availabilitiesAction,
  type NewStudentAvailability,
} from '@/database/actions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { ChevronDownIcon, Pen, Trash2 } from 'lucide-react-native';
import { CheckBox } from '@/components/ui/CheckBox';
import { bootAwareNotificationManager } from '@/lib/notifications/boot-aware-notification-manager';

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';

import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { WeekDayEnum } from '@/@types/enums';
import { notificationManager } from '@/lib/notifications/weekly-notification';

const weekDays = [
  { label: 'Segunda-feira', value: WeekDayEnum.MONDAY },
  { label: 'Terça-feira', value: WeekDayEnum.TUESDAY },
  { label: 'Quarta-feira', value: WeekDayEnum.WEDNESDAY },
  { label: 'Quinta-feira', value: WeekDayEnum.THURSDAY },
  { label: 'Sexta-feira', value: WeekDayEnum.FRIDAY },
  { label: 'Sábado', value: WeekDayEnum.SATURDAY },
  { label: 'Domingo', value: WeekDayEnum.SUNDAY },
];

const getWeekdayLabel = (weekday: WeekDayEnum): string => {
  const day = weekDays.find((d) => d.value === weekday);
  return day?.label || 'Selecione um dia';
};

interface Availability extends NewStudentAvailability {}

export default function CreateStudent() {
  const { isDark } = useTheme();
  const { navigate } = useRouter();
  const { data } = useLocalSearchParams();
  const studentData = JSON.parse(data as string) as Student;
  const studentId = String(studentData?.id);
  const studentName = studentData?.name;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | null>(null);
  const [form, setForm] = useState<Availability>({
    weekday: WeekDayEnum.MONDAY,
    hour: 8,
    minute: 0,
    title: '',
    body: '',
    isActive: true,
    studentId: studentId,
  });

  const {
    data: availabilities = [],
    isLoading: isLoadingAvailabilities,
    refetch: refetchAvailabilities,
  } = useQuery<Availability[]>({
    queryKey: ['availabilities', studentId],
    queryFn: async () => {
      return await availabilitiesAction.getByStudentId(studentId);
    },
  });

  const checkTimeConflict = (
    weekday: WeekDayEnum,
    hour: number,
    minute: number
  ): boolean => {
    return availabilities.some(
      (a) =>
        a.weekday === weekday &&
        a.hour === hour &&
        a.minute === minute &&
        (editingAvailability ? a.id !== editingAvailability.id : true)
    );
  };

  const checkNearbyTime = (
    weekday: WeekDayEnum,
    hour: number,
    minute: number
  ): boolean => {
    return availabilities.some(
      (a) =>
        a.weekday === weekday &&
        Math.abs(a.hour * 60 + a.minute - (hour * 60 + minute)) <= 30 &&
        (editingAvailability ? a.id !== editingAvailability.id : true)
    );
  };

  const resetForm = () => {
    setForm({
      weekday: WeekDayEnum.MONDAY,
      hour: 8,
      minute: 0,
      title: '',
      body: '',
      isActive: true,
      studentId: studentId,
    });
    setEditingAvailability(null);
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleAddOrUpdate = async () => {
    const newBlock: Availability = {
      ...form,
      studentId: studentId,
    };
    const hasTimeConflict = availabilities.some(
      (a) =>
        a.weekday === newBlock.weekday &&
        a.hour === newBlock.hour &&
        a.minute === newBlock.minute &&
        (editingAvailability ? a.id !== editingAvailability.id : true)
    );
    if (hasTimeConflict) {
      const conflictingDay = getWeekdayLabel(newBlock.weekday);
      const timeString = `${String(newBlock.hour).padStart(2, '0')}:${String(
        newBlock.minute
      ).padStart(2, '0')}`;
      Alert.alert(
        'Conflito de Horário',
        `Já existe um lembrete configurado para ${conflictingDay} às ${timeString}.\n\nPor favor, escolha um horário diferente.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAvailability) {
        await bootAwareNotificationManager.updateNotification(
          editingAvailability.id!,
          {
            ...newBlock,
            name: studentName ?? '',
            title: `📅 Visita para ${studentName}`,
            body: `Lembrete: sua visita para ${studentName} está marcada para hoje às ${String(
              newBlock.hour
            ).padStart(2, '0')}:${String(newBlock.minute).padStart(2, '0')}.`,
          }
        );
      } else {
        await bootAwareNotificationManager.createWeeklyNotification({
          ...newBlock,
          name: studentName ?? '',
          title: `📅 Visita para ${studentName}`,
          body: `Lembrete: sua visita para ${studentName} está marcada para hoje às ${String(
            newBlock.hour
          ).padStart(2, '0')}:${String(newBlock.minute).padStart(2, '0')}.`,
        });
      }
      await refetchAvailabilities();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar disponibilidade:', error);
      Alert.alert('Erro', 'Não foi possível salvar a disponibilidade.');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (availability: Availability) => {
    setForm({
      id: availability.id,
      weekday: availability.weekday,
      hour: availability.hour,
      minute: availability.minute,
      title: availability.title,
      body: availability.body,
      isActive: availability.isActive,
      studentId: availability.studentId,
    });
    setEditingAvailability(availability);
    setShowForm(true);
  };

  const handleRemove = async (availability: Availability) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja remover esta disponibilidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              if (availability.id) {
                await bootAwareNotificationManager.deleteNotification(
                  availability.id
                );
              }
              await refetchAvailabilities();
            } catch (error) {
              console.error('Erro ao remover disponibilidade:', error);
            }
            setIsSubmitting(false);
          },
        },
      ]
    );
  };

  function onGoBack() {
    navigate({
      pathname: '/(drawer)/(tabs)/students/profile',
      params: {
        id: studentData.id,
      },
    });
  }

  const handleAddAvailability = () => {
    setShowForm(true);
    setEditingAvailability(null);
    setForm({
      weekday: WeekDayEnum.MONDAY,
      hour: 8,
      minute: 0,
      title: '',
      body: '',
      isActive: true,
      studentId: studentId,
    });
  };

  useEffect(() => {
    notificationManager.requestPermissions();
  }, []);

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center gap-2"
          lightColor="#F6F6F9"
        >
          <BackButton onPress={onGoBack} />
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over">
              Melhores Horários para Visita{' '}
              {studentName ? `(${studentName})` : ''}
            </Text>
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-11 h-1 rounded-lg mt-2"
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
        }}
      >
        <View className="mt-4">
          {isLoadingAvailabilities ? (
            <View className="gap-2">
              <View className="flex-row items-center gap-4">
                <Skeleton variant="rounded" className="h-10 w-10" />
                <Skeleton variant="rounded" className="h-10 w-full" />
              </View>
              <View className="flex-row items-center gap-4">
                <Skeleton variant="rounded" className="h-10 w-10" />
                <Skeleton variant="rounded" className="h-10 w-full" />
              </View>
            </View>
          ) : availabilities.length === 0 ? (
            <Text style={{ color: '#888' }}>
              Nenhuma disponibilidade cadastrada.
            </Text>
          ) : (
            availabilities.map((item, index) => (
              <View
                key={item.id ?? `${item.weekday}-${index.toString()}`}
                className="flex-row items-center mb-4"
              >
                <View className="flex-1 rounded-lg flex-row justify-between items-center">
                  <View className="flex-1 p-3">
                    <Text className="font-title text-base mb-1 flex-row items-center justify-between gap-4">
                      {getWeekdayLabel(item?.weekday as WeekDayEnum)}
                    </Text>
                    <Text className="font-body text-sm text-[#717171] mb-1">
                      {item?.hour?.toString().padStart(2, '0')}:
                      {item?.minute?.toString().padStart(2, '0')} - Receber
                      Lembrete: {item.isActive ? 'Sim' : 'Não'}
                    </Text>
                  </View>
                </View>

                <View
                  className="flex-row items-center gap-2"
                  lightColor="transparent"
                >
                  <TouchableOpacity
                    lightColor={Colors.light.tint}
                    darkColor={Colors.dark.tint}
                    className="w-9 h-9 justify-center items-center rounded"
                    onPress={() => handleEdit(item)}
                  >
                    <Pen color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    lightColor={Colors.light.Error}
                    darkColor={Colors.dark.Error}
                    className="w-9 h-9 justify-center items-center rounded"
                    onPress={() => handleRemove(item)}
                  >
                    <Trash2 color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            onPress={handleAddAvailability}
            activeOpacity={0.7}
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            disabled={isSubmitting}
            className="rounded-lg py-3 px-4 mt-4 w-3/4 flex items-center justify-center"
            style={{
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            <Text lightColor="white" darkColor="white" className="text-base">
              + Adicionar Disponibilidade
            </Text>
          </TouchableOpacity>
        </View>

        <Actionsheet
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
        >
          <ActionsheetBackdrop
            onPress={() => {
              setShowForm(false);
              resetForm();
            }}
          />
          <ActionsheetContent style={{ minHeight: '50%' }}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <View className="w-full flex-col gap-2">
              <Text
                className="text-lg font-bold mb-2 mt-4"
                lightColor={Colors.light.tint}
                darkColor={Colors.dark.tint}
              >
                {editingAvailability
                  ? 'Editar Disponibilidade'
                  : 'Adicionar Disponibilidade'}
              </Text>
              <Text className="text-base font-title mb-2">Dia da semana:</Text>
              <Select
                selectedValue={form.weekday.toString()}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, weekday: Number(v) as WeekDayEnum }))
                }
                style={{ marginBottom: 8 }}
              >
                <SelectTrigger variant="outline" size="lg">
                  <SelectInput
                    placeholder="Selecione um dia"
                    className="text-base font-body h-14"
                    value={getWeekdayLabel(form.weekday)}
                  />
                  <SelectIcon className="mr-3 pt-2" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {weekDays.map((day) => (
                      <SelectItem
                        label={day.label}
                        value={day.value.toString()}
                        key={day.value}
                      >
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <Text className="text-base font-title">
                Horário da notificação:
              </Text>
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text
                  style={{
                    padding: 12,
                    backgroundColor: checkTimeConflict(
                      form.weekday,
                      form.hour,
                      form.minute
                    )
                      ? '#ffebee'
                      : checkNearbyTime(form.weekday, form.hour, form.minute)
                      ? '#fff3e0'
                      : '#eee',
                    borderRadius: 4,
                    borderWidth: checkTimeConflict(
                      form.weekday,
                      form.hour,
                      form.minute
                    )
                      ? 1
                      : 0,
                    borderColor: checkTimeConflict(
                      form.weekday,
                      form.hour,
                      form.minute
                    )
                      ? '#f44336'
                      : 'transparent',
                  }}
                  className="text-base font-body"
                >
                  {form.hour?.toString().padStart(2, '0')}:
                  {form.minute?.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>

              {/* Feedback visual para conflitos */}
              {checkTimeConflict(form.weekday, form.hour, form.minute) && (
                <Text style={{ color: '#f44336', fontSize: 12, marginTop: 4 }}>
                  ⚠️ Conflito: Já existe um lembrete neste horário
                </Text>
              )}

              {checkNearbyTime(form.weekday, form.hour, form.minute) &&
                !checkTimeConflict(form.weekday, form.hour, form.minute) && (
                  <Text
                    style={{ color: '#ff9800', fontSize: 12, marginTop: 4 }}
                  >
                    ⚠️ Atenção: Existe um lembrete próximo a este horário no
                    mesmo dia.
                  </Text>
                )}

              <View className="flex-row items-center mt-2 gap-2 w-full">
                <CheckBox
                  title="Receber lembrete"
                  checked={form.isActive}
                  onPress={() =>
                    setForm((f) => ({
                      ...f,
                      isActive: !f.isActive,
                    }))
                  }
                />
              </View>
              <View className="flex-row justify-end gap-2 mt-4 w-full">
                <TouchableOpacity
                  className="py-2 px-5 rounded-lg items-center justify-center"
                  onPress={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <Text
                    lightColor={Colors.light.Error}
                    darkColor={Colors.dark.Error}
                    className="text-white font-text capitalize text-base"
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddOrUpdate}
                  className="py-3 px-5 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: isDark
                      ? Colors.dark.tint
                      : Colors.light.tint,
                    opacity:
                      checkTimeConflict(form.weekday, form.hour, form.minute) ||
                      isSubmitting
                        ? 0.5
                        : 1,
                  }}
                  disabled={
                    isSubmitting ||
                    checkTimeConflict(form.weekday, form.hour, form.minute)
                  }
                >
                  <Text
                    lightColor="white"
                    darkColor="white"
                    className="text-white font-text capitalize text-base"
                  >
                    {editingAvailability ? 'Salvar' : 'Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={new Date(2023, 0, 1, form.hour, form.minute)}
                mode="time"
                display="clock"
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setForm((f) => ({
                      ...f,
                      hour: date.getHours(),
                      minute: date.getMinutes(),
                    }));
                  }
                }}
              />
            )}
          </ActionsheetContent>
        </Actionsheet>
      </ScrollView>
    </View>
  );
}
