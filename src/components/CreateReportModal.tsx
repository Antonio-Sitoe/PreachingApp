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
import { Q } from '@nozbe/watermelondb'

import Modal from 'react-native-modal'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import ButtonQtd from './ui/ButtonQtd'
import ReportHead from './pieces/ReportHead'
import { IReport } from '@/database/schemas/Report/Report'
import { useForm } from '@/hooks/useForm'
import { ReportType } from '@/@types/enums'
import { showMessage } from 'react-native-flash-message'
import uuid from 'react-native-uuid'
import { isSameDay, isSameMonth, isSameYear } from 'date-fns'
import { database } from '@/database/database'
import { useCurrentMonthAndYear } from '@/contexts/ReportContext'
import dayjs from 'dayjs'

interface ReportData {
  date: Date
  comments: string
  hours: number
  minutes: number
  students: number
  publications: number
  returnVisits: number
  videos: number
}
interface CreateReportModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}

export default function CreateReportModal({
  modalVisible,
  setModalVisible,
}: CreateReportModalProps) {
  const { currentMonth, currentYear } = useCurrentMonthAndYear()
  const { isDark } = useTheme()
  const hours = useForm(0)
  const minutes = useForm(0, ReportType.minutes)
  const publications = useForm(0)
  const students = useForm(0)
  const returnVisits = useForm(0)
  const videos = useForm(0)
  const [comments, setComents] = useState('')
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  function handleClose() {
    // setModalVisible(false);
    // setModalVisible(!modalVisible);
  }

  function resetAllStates() {
    setComents('')
    hours.setValue(0)
    minutes.setValue(0)
    students.setValue(0)
    publications.setValue(0)
    returnVisits.setValue(0)
    videos.setValue(0)
  }

  async function createRecord(
    yearId: string,
    monthId: string,
    newRecordData: ReportData,
  ) {
    return database.write(async () => {
      const yearCollection = database.collections.get('years')
      const monthCollection = database.collections.get('months')
      const recordCollection = database.collections.get('reports')

      // Verifique se já existe um registro para a data especificada no mês
      const existingRecord = await recordCollection.query(
        Q.and(
          Q.where('month_id', monthId),
          Q.where('date', String(newRecordData.date)),
        ),
      )
      const col = await recordCollection.query().fetch()
      console.log(newRecordData.date.toString())
      console.log('existingRecord', existingRecord)
      console.log('colecao', col.length)

      // if (existingRecord.length > 0) {
      //   // Se já existe um registro, faça a atualização nos dados do registro existente
      //   const existingRecordId = existingRecord[0].id;

      //   await recordCollection.find(existingRecordId).update((record: any) => {
      //     record.hours += newRecordData.hours;
      //     record.publications += newRecordData.publications;
      //     record.videos += newRecordData.videos;
      //     record.returnVisits += newRecordData.returnVisits;
      //     record.students += newRecordData.students;
      //     // Você pode implementar lógica adicional para combinar ou atualizar outros campos, se necessário.
      //   });

      //   return recordCollection.find(existingRecordId);
      // }

      // Se não existir um registro para a data, crie um novo registro
      // const newRecord = await recordCollection.create((record: any) => {
      //   record.date = String(newRecordData.date)
      //   record.minutes = newRecordData.minutes
      //   record.hours = newRecordData.hours
      //   record.publications = newRecordData.publications
      //   record.videos = newRecordData.videos
      //   record.returnVisits = newRecordData.returnVisits
      //   record.students = newRecordData.students
      //   record.comments = newRecordData.comments
      //   record.month.id = monthId
      // })

      // // Atualize a coleção de meses associada a este registro
      const currentMonth = await monthCollection.find(monthId)
      const currentYear = await yearCollection.find(yearId)

      // currentMonth.update((month: any) => {
      //   month.reports.push(newRecord)
      // })
      // currentYear.update((year: any) => {
      //   year.months.push(monthId)
      // })

      // return newRecord
    })
  }

  async function handleCreateReport() {
    try {
      setIsLoading(true)
      const body = {
        _id: uuid.v4(),
        date,
        comments,
        hours: hours.value,
        minutes: minutes.value,
        students: students.value,
        publications: publications.value,
        returnVisits: returnVisits.value,
        videos: videos.value,
      }
      console.log('submitData')
      const newDate = dayjs(date).format('MM/DD/YYYY')
      console.log('data', newDate)
      // console.log(body)
      // console.log()
      // await createRecord(currentYear?.id, currentMonth?.id, body)
      // setModalVisible(false)
      showMessage({
        message: 'Hello World',
        description: 'This is our second message',
        type: 'success',
      })
      resetAllStates()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
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
        </ScrollView>
      </View>
    </Modal>
  )
}
