import React, { useState } from 'react'
import { Text } from './Themed'
import { Input } from './ui/Input'
import { DatePicker } from './ui/DatePicker'
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native'

import dayjs from 'dayjs'
import Modal from 'react-native-modal'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import ButtonQtd from './ui/ButtonQtd'
import ReportHead from './pieces/ReportHead'

import { useForm } from '@/hooks/useForm'
import { ReportType } from '@/@types/enums'
import { showMessage } from 'react-native-flash-message'
import { createReportData } from '@/database/actions/report/create'
import { useCurrentMonthAndYear } from '@/contexts/ReportContext'
import { ReportData } from '@/@types/interfaces'

interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
}: CreateReportModalProps) {
  const { currentMonth } = useCurrentMonthAndYear()
  const { isDark } = useTheme()
  const hours = useForm(0)
  const minutes = useForm(0, ReportType.minutes)
  const publications = useForm(0)
  const students = useForm(0)
  const returnVisits = useForm(0)
  const videos = useForm(0)
  const [comments, setComents] = useState('')
  const [date, setDate] = useState(new Date())
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateReport() {
    try {
      setError(null)
      setIsLoading(true)
      const data = {
        date: dayjs(date).format('MM/DD/YYYY'),
        comments,
        hours: hours.value,
        minutes: minutes.value,
        students: students.value,
        publications: publications.value,
        returnVisits: returnVisits.value,
        videos: videos.value,
      }

      const isQualified = simpleVerificationBeforeCreation(data)

      if (isQualified === false) {
        setModalVisible(false)
        return false
      }

      let isReportCreated
      if (currentMonth?.id) {
        isReportCreated = await createReportData(currentMonth?.id, data)
      }
      if (isReportCreated) {
        showMessage({
          message: 'Relatório Adicionado com Sucesso',
          description: '',
          type: 'success',
        })
        setModalVisible(false)
      }
      resetAllStates()
    } catch (error) {
      setError('Falha ao criar o relatorio')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  function handleClose() {
    setModalVisible(false)
  }

  function resetAllStates() {
    setComents('')
    setDate(new Date())
    hours.setValue(0)
    minutes.setValue(0)
    students.setValue(0)
    publications.setValue(0)
    returnVisits.setValue(0)
    videos.setValue(0)
  }

  function simpleVerificationBeforeCreation(data: ReportData) {
    if (
      data.hours === 0 &&
      data.minutes === 0 &&
      data.publications === 0 &&
      data.videos === 0 &&
      data.students === 0 &&
      data.returnVisits === 0 &&
      data.comments.trim().length === 0
    ) {
      return false
    } else return true
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
                  value={`${hours.value}`}
                  keyboardType="numeric"
                  className="flex-1 text-sm"
                  placeholder="0"
                  placeholderTextColor="#808080"
                  onChangeText={(text) => hours.onchange(Number(text))}
                />

                <ButtonQtd
                  Increment={hours.inCrementValue}
                  decrement={hours.decrementValue}
                />
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
                  value={`${minutes.value}`}
                  className="flex-1 text-sm"
                  placeholder="0"
                  placeholderTextColor="#808080"
                  keyboardType="numeric"
                  onChangeText={(text) => minutes.onchange(Number(text))}
                />
                <ButtonQtd
                  Increment={minutes.inCrementValue}
                  decrement={minutes.decrementValue}
                />
              </View>
            </View>
          </View>

          <Input.Root label="Publicações">
            <Input.Content
              actions={true}
              keyboardType="number-pad"
              value={`${publications.value}`}
              onChangeText={(text) => publications.onchange(Number(text))}
            />
            <Input.Actions
              Increment={publications.inCrementValue}
              decrement={publications.decrementValue}
            />
          </Input.Root>
          <Input.Root label="Videos">
            <Input.Content
              value={`${videos.value}`}
              onChangeText={(text) => videos.onchange(Number(text))}
              actions={true}
            />
            <Input.Actions
              Increment={videos.inCrementValue}
              decrement={videos.decrementValue}
            />
          </Input.Root>
          <Input.Root label="Estudos">
            <Input.Content
              value={`${students.value}`}
              onChangeText={(text) => students.onchange(Number(text))}
              actions={true}
            />
            <Input.Actions
              Increment={students.inCrementValue}
              decrement={students.decrementValue}
            />
          </Input.Root>
          <Input.Root label="Revisitas">
            <Input.Content
              actions={true}
              value={`${returnVisits.value}`}
              onChangeText={(text) => returnVisits.onchange(Number(text))}
            />
            <Input.Actions
              Increment={returnVisits.inCrementValue}
              decrement={returnVisits.decrementValue}
            />
          </Input.Root>

          <Text className="font-textIBM text-base ml-1 mb-1 mr-6">
            Comentarios
          </Text>
          <TextInput
            placeholder="Escreva aqui..."
            value={comments}
            onChangeText={setComents}
            numberOfLines={3}
            maxLength={140}
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
              onPress={handleClose}
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
              disabled={isLoading}
              onPress={handleCreateReport}
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
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-textIBM">
                  Guardar
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {error && <Text className="mt-1 ml-1 text-red-600">{error}</Text>}
        </ScrollView>
      </View>
    </Modal>
  )
}
