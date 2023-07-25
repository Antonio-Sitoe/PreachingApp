import { View, Text, Modal, TouchableOpacity } from 'react-native'
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-[#00000080]">
        <View
          className="h-screen w-full"
          style={{
            backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
          }}
        >
          <ReportHead onclick={handleClose} />
          <View className=" px-3 pt-6">
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
                <View className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl">
                  <TextInput value="5645" />
                  <ButtonQtd />
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-textIBM text-base ml-1 mb-1">
                  Minutos
                </Text>
                <View className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl">
                  <TextInput value="5645" />
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
            <Input.Root label="Estudos Individuas">
              <Input.Content actions={true} />
              <Input.Actions />
            </Input.Root>
            <Input.Root label="Revisitas">
              <Input.Content actions={true} />
              <Input.Actions />
            </Input.Root>

            <Text className="font-textIBM text-base ml-1 mb-1 mr-6">
              Comentarios
            </Text>
            <TextInput
              placeholder="Publicacoes"
              numberOfLines={4}
              editable
              multiline
              className="bg-ligtInputbG w-full h-[80px] pl-3 pr-1 rounded-xl"
            />

            <View className="mt-2 flex-row justify-between">
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
                  backgroundColor: Colors.light.tint,
                  paddingTop: 9,
                  paddingBottom: 9,
                  borderRadius: 8,
                  marginLeft: 2.5,
                }}
              >
                <Text className="text-white text-base font-textIBM">
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
