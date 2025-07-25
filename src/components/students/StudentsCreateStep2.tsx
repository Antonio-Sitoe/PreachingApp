import TouchableOpacity, { Text, View } from '@/components/Themed';
import { TextInputForm } from '@/components/ui/TextInputForm';

import React, { useState } from 'react';

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

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { ChevronDownIcon, Pen, Trash2 } from 'lucide-react-native';
import { CheckBox } from '../ui/CheckBox';

const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface Availability {
  weekDay: string;
  startTime: string;
  endTime: string;
  notificationEnabled: boolean;
}

export function StudentsCreateStep2({
  control,
  errors,
  value = [],
  onChange,
}: {
  control: any;
  errors: any;
  value?: Availability[];
  onChange?: (availabilities: Availability[]) => void;
}) {
  const { isDark } = useTheme();
  const [availabilities, setAvailabilities] = useState<Availability[]>(value);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<{
    weekDay: string;
    startTime: Date;
    endTime: Date;
    notificationEnabled: boolean;
  }>({
    weekDay: weekDays[0],
    startTime: new Date(2023, 0, 1, 8, 0),
    endTime: new Date(2023, 0, 1, 10, 0),
    notificationEnabled: true,
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const resetForm = () => {
    setForm({
      weekDay: weekDays[0],
      startTime: new Date(2023, 0, 1, 8, 0),
      endTime: new Date(2023, 0, 1, 10, 0),
      notificationEnabled: true,
    });
    setEditingIndex(null);
  };

  const handleAddOrUpdate = () => {
    const newBlock: Availability = {
      weekDay: form.weekDay,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime),
      notificationEnabled: form.notificationEnabled,
    };
    let newAvailabilities: Availability[];
    if (editingIndex !== null) {
      newAvailabilities = availabilities.map((a, i) =>
        i === editingIndex ? newBlock : a
      );
    } else {
      newAvailabilities = [...availabilities, newBlock];
    }
    setAvailabilities(newAvailabilities);
    onChange && onChange(newAvailabilities);
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const a = availabilities[index];
    setForm({
      weekDay: a.weekDay,
      startTime: new Date(2023, 0, 1, ...a.startTime.split(':').map(Number)),
      endTime: new Date(2023, 0, 1, ...a.endTime.split(':').map(Number)),
      notificationEnabled: a.notificationEnabled,
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemove = (index: number) => {
    const newAvailabilities = availabilities.filter((_, i) => i !== index);
    setAvailabilities(newAvailabilities);
    if (onChange) {
      onChange(newAvailabilities);
    }
  };

  function addOneHour(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours((date.getHours() + 1) % 24);
    return newDate;
  }

  return (
    <>
      <View style={{ marginVertical: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
          Melhores Horários para Visitas
        </Text>
        {availabilities.length === 0 && (
          <Text style={{ color: '#888' }}>
            Nenhuma disponibilidade cadastrada.
          </Text>
        )}
        {availabilities.map((item, index) => (
          <View
            key={item.weekDay + '-' + index.toString()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <View className="flex-1 rounded-lg flex-row justify-between items-center">
              <View className="flex-1 p-3">
                <Text className="font-title text-base mb-1 flex-row items-center justify-between gap-4">
                  {item.weekDay}
                </Text>
                <Text className="font-body text-sm text-[#717171] mb-1">
                  {item.startTime} - {item.endTime} | Receber Lembrete:{' '}
                  {item.notificationEnabled ? 'Sim' : 'Não'}
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
                onPress={() => handleEdit(index)}
              >
                <Pen color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                lightColor={Colors.light.Error}
                darkColor={Colors.dark.Error}
                className="w-9 h-9 justify-center items-center rounded"
                onPress={() => handleRemove(index)}
              >
                <Trash2 color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          lightColor={Colors.light.tint}
          darkColor={Colors.dark.tint}
          onPress={() => setShowForm(true)}
          className="rounded-lg p-2 mt-4"
          style={{ alignSelf: 'flex-start' }}
        >
          <Text
            lightColor="white"
            darkColor="white"
            className="text-white font-title text-base"
          >
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
              Adicionar/Editar Disponibilidade
            </Text>
            <Text className="text-base font-title mb-2">Dia da semana:</Text>
            <Select
              selectedValue={form.weekDay}
              onValueChange={(v) => setForm((f) => ({ ...f, weekDay: v }))}
              style={{ marginBottom: 8 }}
            >
              <SelectTrigger variant="outline" size="lg">
                <SelectInput
                  placeholder="Select option"
                  className="text-base font-body h-14"
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
                    <SelectItem label={day} value={day} key={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

            <Text className="text-base font-title">Horário de início:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text
                style={{
                  padding: 12,
                  backgroundColor: '#eee',
                  borderRadius: 4,
                }}
                className="text-base font-body"
              >
                {formatTime(form.startTime)}
              </Text>
            </TouchableOpacity>

            <Text className="text-base font-title">Horário de fim:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text
                style={{
                  padding: 12,
                  backgroundColor: '#eee',
                  borderRadius: 4,
                }}
                className="text-base font-body"
              >
                {formatTime(form.endTime)}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center mt-2 gap-2 w-full">
              <CheckBox
                title="Receber lembrete"
                checked={form.notificationEnabled}
                onPress={() =>
                  setForm((f) => ({
                    ...f,
                    notificationEnabled: !f.notificationEnabled,
                  }))
                }
              />
            </View>
            <View className="flex-row justify-end gap-2 mt-4 w-full">
              <TouchableOpacity
                className="py-2 px-5 rounded-lg items-center justify-center bg-[#FF647C]"
                onPress={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <Text
                  lightColor="white"
                  darkColor="white"
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
                }}
              >
                <Text
                  lightColor="white"
                  darkColor="white"
                  className="text-white font-text capitalize text-base"
                >
                  {editingIndex !== null ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={form.startTime}
              mode="time"
              is24Hour
              display="default"
              onChange={(_, date) => {
                setShowStartPicker(false);
                if (date) {
                  // Se a nova hora de início for >= hora de fim, ajusta a hora de fim
                  let newEndTime = form.endTime;
                  if (
                    date.getHours() > form.endTime.getHours() ||
                    (date.getHours() === form.endTime.getHours() &&
                      date.getMinutes() >= form.endTime.getMinutes())
                  ) {
                    newEndTime = addOneHour(date);
                  }
                  setForm((f) => ({
                    ...f,
                    startTime: date,
                    endTime: newEndTime,
                  }));
                }
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={form.endTime}
              mode="time"
              is24Hour
              display="default"
              onChange={(_, date) => {
                setShowEndPicker(false);
                if (date) {
                  // Se a nova hora de fim for <= hora de início, ajusta para igual à hora de início
                  if (
                    date.getHours() < form.startTime.getHours() ||
                    (date.getHours() === form.startTime.getHours() &&
                      date.getMinutes() <= form.startTime.getMinutes())
                  ) {
                    setForm((f) => ({ ...f, endTime: f.startTime }));
                  } else {
                    setForm((f) => ({ ...f, endTime: date }));
                  }
                }
              }}
            />
          )}
        </ActionsheetContent>
      </Actionsheet>

      <View className="mb-4 flex-1">
        <TextInputForm
          control={control}
          errors={errors}
          label="Localização"
          name="address"
          placeholder=""
          rules={{}}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </>
  );
}
