import { View, Text, Modal, Keyboard } from 'react-native'
import { Minus, Plus } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import { DatePicker } from './ui/DatePicker'

interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
}: CreateReportModalProps) {
  const [date, setDate] = useState(new Date())

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible)
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-[#00000080] p-8">
          <View className="bg-white w-full rounded-md px-3 py-4">
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
                  <View className="flex-row align-middle justify-between  bg-primary p-1 rounded-xl">
                    <TouchableOpacity
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text className="text-white">-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text className="text-white">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-textIBM text-base ml-1 mb-1">
                  Minutos
                </Text>
                <View className="bg-ligtInputbG w-full h-[47px] flex-row items-center justify-between pl-3 pr-1 py-3 rounded-xl">
                  <TextInput value="5645" />
                  <View className="flex-row align-middle justify-between  bg-primary p-1 rounded-xl">
                    <TouchableOpacity
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text className="text-white">
                        <Minus color="white" />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text className="text-white">
                        <Plus color="white" />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3 mb-3">
              <TextInput
                placeholder="Publicacoes"
                className="bg-ligtInputbG flex-1 h-[47px] pl-3 pr-1 py-3 rounded-xl"
              />
              <View className="flex-row w-28 align-middle justify-between  bg-primary p-1 rounded-xl">
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Minus color="white" />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Plus color="white" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-3 flex-row gap-3">
              <TextInput
                placeholder="Videos"
                className="bg-ligtInputbG flex-1 h-[47px] pl-3 pr-1 py-3 rounded-xl"
              />
              <View className="flex-row w-28 align-middle justify-between  bg-primary p-1 rounded-xl">
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Minus color="white" />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Plus color="white" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-3 flex-row gap-3">
              <TextInput
                placeholder="Estudos Individuas"
                className="bg-ligtInputbG flex-1 h-[47px] pl-3 pr-1 py-3 rounded-xl"
              />
              <View className="flex-row w-28 align-middle justify-between  bg-primary p-1 rounded-xl">
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Minus color="white" />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Plus color="white" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-3 flex-row gap-3">
              <TextInput
                placeholder="Revisitas"
                className="bg-ligtInputbG flex-1 h-[47px] pl-3 pr-1 py-3 rounded-xl"
              />
              <View className="flex-row w-28 align-middle justify-between  bg-primary p-1 rounded-xl">
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white text-xl">
                    <Minus color="white" />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 'auto',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              placeholder="Comentarios"
              className="bg-ligtInputbG  p-3 mb-3 rounded-xl"
            />

            <View className="flex-row gap-2 w-full">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FF647C',
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 8,
                }}
              >
                <Text className="text-white text-base font-textIBM">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.light.tint,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 8,
                }}
              >
                <Text className="text-white text-base font-textIBM">
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
