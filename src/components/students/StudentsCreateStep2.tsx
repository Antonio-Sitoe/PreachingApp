import { Text, View } from '@/components/Themed';
import { TextInputForm } from '@/components/ui/TextInputForm';

import React, { useState } from 'react';
import { TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export function StudentsCreateStep2({ control, errors, value = [], onChange }) {
  const [availabilities, setAvailabilities] = useState(value);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
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
    const newBlock = {
      weekDay: form.weekDay,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime),
      notificationEnabled: form.notificationEnabled,
    };
    let newAvailabilities;
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

  const handleEdit = (index) => {
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

  const handleRemove = (index) => {
    const newAvailabilities = availabilities.filter((_, i) => i !== index);
    setAvailabilities(newAvailabilities);
    onChange && onChange(newAvailabilities);
  };

  return (
    <>
      <View style={{ marginVertical: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
          Disponibilidade para Visitas
        </Text>
        {availabilities.length === 0 && (
          <Text style={{ color: '#888' }}>
            Nenhuma disponibilidade cadastrada.
          </Text>
        )}
        {availabilities.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ flex: 1 }}>
              {item.weekDay} {item.startTime} - {item.endTime} | Lembrete:{' '}
              {item.notificationEnabled ? 'Sim' : 'Não'}
            </Text>
            <TouchableOpacity onPress={() => handleEdit(index)}>
              <Text style={{ color: 'blue', marginRight: 10 }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(index)}>
              <Text style={{ color: 'red' }}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
        {showForm ? (
          <View
            style={{
              backgroundColor: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              Adicionar/Editar Disponibilidade
            </Text>
            <Text>Dia da semana:</Text>
            <Picker
              selectedValue={form.weekDay}
              onValueChange={(v) => setForm((f) => ({ ...f, weekDay: v }))}
              style={{ marginBottom: 8 }}
            >
              {weekDays.map((day) => (
                <Picker.Item label={day} value={day} key={day} />
              ))}
            </Picker>
            <Text>Horário de início:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text
                style={{ padding: 8, backgroundColor: '#eee', borderRadius: 4 }}
              >
                {formatTime(form.startTime)}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={form.startTime}
                mode="time"
                is24Hour
                display="default"
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) setForm((f) => ({ ...f, startTime: date }));
                }}
              />
            )}
            <Text>Horário de fim:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text
                style={{ padding: 8, backgroundColor: '#eee', borderRadius: 4 }}
              >
                {formatTime(form.endTime)}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={form.endTime}
                mode="time"
                is24Hour
                display="default"
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) setForm((f) => ({ ...f, endTime: date }));
                }}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text>Receber lembrete:</Text>
              <Switch
                value={form.notificationEnabled}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, notificationEnabled: v }))
                }
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <Text style={{ color: 'gray' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddOrUpdate}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>
                  {editingIndex !== null ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={{ marginTop: 12, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>
              + Adicionar Disponibilidade
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
