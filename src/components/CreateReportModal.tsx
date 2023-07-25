import { View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import Modal from 'react-native-modal'
import { Text } from './Themed'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import { DatePicker } from './ui/DatePicker'

import ReportHead from './pieces/ReportHead'
import ButtonQtd from './ui/ButtonQtd'
import { Input } from './ui/Input'
import useTheme from '@/hooks/useTheme'

interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
}: CreateReportModalProps) {
  const { isDark } = useTheme()
  const [date, setDate] = useState(new Date())

  function handleClose() {
    setModalVisible(!modalVisible)
  }

  return (
    <Modal propagateSwipe={true} isVisible={modalVisible}>
      <View
        style={{
          backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
        }}
        className="w-full h-full bg-[#00000080]"
      >
        <ReportHead isDark={isDark} onclick={handleClose} />
        <ScrollView
          className="px-3 pt-6"
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          <DatePicker date={date} setDate={setDate} />
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              width: 'auto',
              marginBottom: 13,
            }}
          >
            <View className="flex-1">
              <Text className="font-textIBM text-base ml-1 mb-1">Horas</Text>
              <View
                style={{
                  backgroundColor: isDark
                    ? Colors.dark.background
                    : Colors.light.ligtInputbG,
                }}
                className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl"
              >
                <TextInput
                  style={{
                    color: isDark ? 'white' : 'black',
                  }}
                  value="5645"
                  className="flex-1"
                  placeholder="0"
                  placeholderTextColor="#808080"
                />

                <ButtonQtd />
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-textIBM text-base ml-1 mb-1">Minutos</Text>
              <View
                style={{
                  backgroundColor: isDark
                    ? Colors.dark.background
                    : Colors.light.ligtInputbG,
                }}
                className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl"
              >
                <TextInput
                  style={{
                    color: isDark ? 'white' : 'black',
                  }}
                  value="5645"
                  className="flex-1"
                  placeholder="0"
                  placeholderTextColor="#808080"
                />
                <ButtonQtd />
              </View>
            </View>
          </View>

          <Input.Root label="Publicacoes">
            <Input.Content actions={true} />
            <Input.Actions />
          </Input.Root>
          <Input.Root label="Videos">
            <Input.Content actions={true} />
            <Input.Actions />
          </Input.Root>
          <Input.Root label="Estudos">
            <Input.Content actions={true} />
            <Input.Actions />
          </Input.Root>
          <Input.Root label="Revisitas">
            <Input.Content actions={true} />
            <Input.Actions />
          </Input.Root>

          <Text className="font-textIBM text-base ml-1 mt-3 mb-1 mr-6">
            Comentarios
          </Text>
          <TextInput
            placeholder="Escreva aqui..."
            numberOfLines={3}
            editable
            multiline
            placeholderTextColor="#808080"
            style={{
              color: isDark ? 'white' : 'black',
              backgroundColor: isDark
                ? Colors.dark.background
                : Colors.light.ligtInputbG,
            }}
            className="bg-ligtInputbG placeholder:text-gray-500 font-textIBM text-sm w-full h-[80px] pl-3 pr-1 rounded-xl"
          />

          <View className="mt-6 flex-row justify-between">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                width: '48%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF647C',
                paddingTop: 9,
                paddingBottom: 9,
                borderRadius: 8,
                marginRight: 2.5,
              }}
            >
              <Text className="text-white text-base font-textIBM">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '48%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                paddingTop: 9,
                paddingBottom: 9,
                borderRadius: 8,
                marginLeft: 2.5,
              }}
            >
              <Text className="text-white text-base font-textIBM">Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}
