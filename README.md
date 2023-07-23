/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */


```
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import { Minus, Plus } from 'lucide-react-native'
import React, { useState } from 'react'
import { TextInput, RectButton } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import { IconIOS } from '@/assets/icons/Icon'
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

import dayjs from 'dayjs'

interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}

function formateDate(date: Date) {
  return dayjs(date).format('DD [de] MMMM [de] YYYY')
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
}: CreateReportModalProps) {
  const [date, setDate] = useState(() => {
    return formateDate(new Date())
  })
  console.log(date)

  const onChange = (event: DateTimePickerEvent, selectedDate: any) => {
    const currentDate = selectedDate
    setDate(currentDate)
  }

  const showMode = (currentMode: 'date') => {
    DateTimePickerAndroid.open({
      value: dayjs(date).toDate(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    })
  }

  const showDatepicker = () => {
    showMode('date')
  }
  const style = {
    borderWidth: 1,
    borderColor: 'red',
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible)
      }}
    >
      <View className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-[#00000080] p-8">
        <View className="bg-white w-full rounded-md px-3 py-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={showDatepicker}
            style={{
              marginBottom: 13,
              height: 47,
              width: 'auto',
              backgroundColor: Colors.light.tint,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              borderRadius: 8,
            }}
          >
            <IconIOS
              name="calendar-outline"
              size={28}
              color={Colors.light.ligtInputbG}
            />
            <Text className="text-base text-white font-textIBM">{date}</Text>
          </TouchableOpacity>
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
              <Text className="font-textIBM text-base ml-1 mb-1">Minutos</Text>
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
          <View className="mb-3">
            <Text className="font-textIBM text-base ml-1 mb-1">
              Publicacoes
            </Text>
            <View className="mt-3 flex-row gap-3">
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
          </View>
          <View className="mb-3">
            <Text className="font-textIBM text-base ml-1 mb-1">Videos</Text>
            <View className="mt-3 flex-row gap-3">
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
          </View>
          <View className="mb-3">
            <Text className="font-textIBM text-base ml-1 mb-1">
              Estudos Individuas
            </Text>
            <View className="mt-3 flex-row gap-3">
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
          </View>
          <View className="mb-3">
            <Text className="font-textIBM text-base ml-1 mb-1">Revisitas</Text>
            <View className="mt-3 flex-row gap-3">
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
                  <Plus color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="mb-3">
            <Text className="font-textIBM text-base ml-1 mb-1">
              Comentarios
            </Text>
            <TextInput
              placeholder="Publicacoes"
              className="bg-ligtInputbG h-24 pl-3 pr-1 py-3 rounded-xl"
            />
          </View>
          <View className="mb-3 flex-row gap-2 w-full">
            <TouchableOpacity
              style={{
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF647C',
              }}
            >
              <Text className="text-white text-xl">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF647C',
              }}
            >
              <Text className="text-white text-xl">Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

```
