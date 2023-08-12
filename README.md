


### TO BUILD
### URL
<a href="https://docs.expo.dev/build-reference/apk/">BUILD URL</a>


### PAGINACAO


import React, { useEffect, useState } from 'react'
import { Text } from './Themed'

import {
  TextInput as TextComent,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@react-native-material/core'
import { DatePicker } from './ui/DatePicker'
import { View, TextInput } from 'react-native'

import dayjs from 'dayjs'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import ButtonQtd from './ui/ButtonQtd'

import { useForm } from '@/hooks/useForm'
import { ReportType } from '@/@types/enums'

import { createReportData } from '@/database/actions/report/create'
import { ReportData } from '@/@types/interfaces'
import { useReportsData } from '@/contexts/ReportContext'
import { currentDates, monthNameToPortuguese } from '@/utils/dates'

interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
  initialData: ReportData
  reset(): void
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
  initialData,
  reset,
}: CreateReportModalProps) {
  const { isDark } = useTheme()

  const { updateCurrentReports } = useReportsData()
  const hours = useForm(initialData.hours)
  const minutes = useForm(initialData.minutes, ReportType.minutes)
  const publications = useForm(initialData.publications)
  const students = useForm(initialData.students)
  const returnVisits = useForm(initialData.returnVisits)
  const videos = useForm(initialData.videos)
  const [comments, setComents] = useState(initialData.comments || '')
  const [date, setDate] = useState(new Date())
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateReport() {
    try {
      setError(null)
      setIsLoading(true)
      const { data, isQualified } = formateDataBeforeSend()
      if (isQualified === false) {
        setModalVisible(false)
        return false
      }
      const isReportCreated = await createReportData(data)
      await updateCurrentReports(currentDates.month, currentDates.year)
      if (isReportCreated) {
        // showMessage({
        //   message: 'Relatório Adicionado com Sucesso',
        //   description: '',
        //   type: 'success',
        // })
        setModalVisible(false)
        resetAllStates()
      }
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
    hours.setValue('')
    minutes.setValue('')
    students.setValue('')
    publications.setValue('')
    returnVisits.setValue('')
    videos.setValue('')
    reset()
  }
  function formateDataBeforeSend() {
    const dateformated = dayjs(date).format('DD/MM/YYYY')
    const day = dayjs(date).get('date')
    const month = monthNameToPortuguese(dayjs(date).get('month') + 1)
    const year = dayjs(date).get('y')

    const data = {
      date: dateformated,
      day,
      month,
      year,
      comments,
      hours: Number(hours.value),
      minutes: Number(minutes.value),
      students: Number(students.value),
      publications: Number(publications.value),
      returnVisits: Number(returnVisits.value),
      videos: Number(videos.value),
      createdAt: date,
    } as ReportData
    const isQualified = simpleVerificationBeforeCreation(data)
    console.log('data to send', data)
    return { data, isQualified }
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

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return (
    <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
      <DialogContent>
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
                onChangeText={(text) => hours.onchange(text)}
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
                keyboardType="numeric"
                onChangeText={minutes.onchange}
              />
              <ButtonQtd
                Increment={minutes.inCrementValue}
                decrement={minutes.decrementValue}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            width: 'auto',
            marginBottom: 13,
          }}
        >
          <View className="flex-1">
            <Text className="font-textIBM text-base ml-1 mb-1">
              Publicações
            </Text>
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
                value={`${publications.value}`}
                onChangeText={publications.onchange}
                keyboardType="numeric"
                className="flex-1 text-sm"
              />
              <ButtonQtd
                Increment={publications.inCrementValue}
                decrement={publications.decrementValue}
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-textIBM text-base ml-1 mb-1">Videos</Text>
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
                className="flex-1 text-sm"
                keyboardType="numeric"
                value={`${videos.value}`}
                onChangeText={videos.onchange}
              />
              <ButtonQtd
                Increment={videos.inCrementValue}
                decrement={videos.decrementValue}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            width: 'auto',
            marginBottom: 13,
          }}
        >
          <View className="flex-1">
            <Text className="font-textIBM text-base ml-1 mb-1">Estudos</Text>
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
                keyboardType="numeric"
                className="flex-1 text-sm"
                value={`${students.value}`}
                onChangeText={students.onchange}
              />

              <ButtonQtd
                Increment={students.inCrementValue}
                decrement={students.decrementValue}
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-textIBM text-base ml-1 mb-1">Revisitas</Text>
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
                value={`${returnVisits.value}`}
                onChangeText={returnVisits.onchange}
                className="flex-1 text-sm"
                keyboardType="numeric"
              />
              <ButtonQtd
                Increment={returnVisits.inCrementValue}
                decrement={returnVisits.decrementValue}
              />
            </View>
          </View>
        </View>

        <TextComent
          placeholder="Escreva aqui..."
          value={comments}
          onChangeText={setComents}
          numberOfLines={3}
          maxLength={140}
          editable
          multiline
          variant="standard"
          label="Comentario"
          className="bg-ligtInputbG font-textIBM text-sm w-full h-[80px] pl-3 pr-1 rounded-xl"
        />
      </DialogContent>

      <DialogActions className="mt-6 flex-row justify-between">
        <Button
          onPress={handleClose}
          title="Cancel"
          variant="contained"
          color="#FF647C"
          titleStyle={{
            color: 'white',
            fontFamily: 'Inter_400Regular',
            textTransform: 'capitalize',
          }}
        />
        <Button
          onPress={handleCreateReport}
          title="Guardar"
          variant="contained"
          loading={isLoading}
          color={isDark ? Colors.dark.tint : Colors.light.tint}
          titleStyle={{
            color: 'white',
            fontFamily: 'Inter_400Regular',
            textTransform: 'capitalize',
          }}
        />
      </DialogActions>
      {error && <Text className="mt-1 ml-1 text-red-600">{error}</Text>}
    </Dialog>
  )
}
