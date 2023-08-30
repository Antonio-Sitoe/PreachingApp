import { useEffect, useState } from 'react'
import { Text } from '@/components/Themed'
import {
  TextInput as TextComent,
  DialogActions,
  Button,
} from '@react-native-material/core'

import { DatePicker } from '@/components/ui/DatePicker'
import { View } from 'react-native'

import dayjs from 'dayjs'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Snackbar from 'react-native-snackbar'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { ReportData } from '@/@types/interfaces'
import { ViewWithLoad } from '@/components/ui/ViewWithLoad'
import { createReportData } from '@/database/actions/report/create'
import { UPDATE_REPORT_BY_ID } from '@/database/actions/report/update'
import { FormInput } from '@/components/ui/FormInput'
import { useReportsData } from '@/contexts/ReportContext'
import { currentDates, monthNameToPortuguese } from '@/utils/dates'
import { GET_REPORT_BY_ID } from '@/database/actions/report/read'

export default function CreateReportModal() {
  const { id, h, m } = useLocalSearchParams<any>()
  const router = useRouter()
  const { isDark } = useTheme()
  const { updateCurrentReports } = useReportsData()

  const [isRendered, setIsRendered] = useState(false)
  const [hours, setHours] = useState<string | number>(h || '')
  const [minutes, setminutes] = useState<string | number>(m || '')
  const [videos, setvideos] = useState<string | number>('')
  const [students, setstudents] = useState<string | number>('')
  const [returnVisits, setreturnVisits] = useState<string | number>('')
  const [publications, setpublications] = useState<string | number>('')
  const [date, setDate] = useState(new Date())
  const [comments, setComents] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleChange = (setValue) => (value) => setValue(value)
  const InCHours = () => setHours(Number(hours) + 1)
  const decHours = () => setHours(Number(hours) > 1 ? Number(hours) - 1 : '')

  const handleChangeMinuts = (value: string) => {
    if (Number(value) >= 60) {
      return Number(value)
    } else {
      setminutes(Number(value))
    }
  }

  const InCMinutes = () =>
    setminutes(Number(minutes) >= 59 ? minutes : Number(minutes) + 1)
  const decMinutes = () =>
    setminutes(Number(minutes) > 1 ? Number(minutes) - 1 : '')

  const incVideos = () => setvideos(Number(videos) + 1)
  const decVideos = () =>
    setvideos(Number(videos) > 1 ? Number(videos) - 1 : '')

  const incStudents = () => setstudents(Number(students) + 1)
  const decStudents = () =>
    setstudents(Number(students) > 1 ? Number(students) - 1 : '')

  const incReturnVisits = () => setreturnVisits(Number(returnVisits) + 1)
  const decReturnVisits = () => setreturnVisits(Number(returnVisits) + 1)

  const incPublications = () => setpublications(Number(publications) + 1)
  const decPublications = () => setpublications(Number(publications) + 1)

  async function handleCreateReport() {
    try {
      setError(null)
      setIsLoading(true)
      const { data, isQualified } = formateDataBeforeSend()
      if (isQualified === false) {
        handleClose()
        return false
      }
      if (id) {
        await UPDATE_REPORT_BY_ID(id, data)
      } else {
        await createReportData(data)
      }
      await updateCurrentReports(currentDates.month, currentDates.year)
      Snackbar.show({
        text: 'Relatório Adicionado com Sucesso',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#54a72e',
      })
      handleClose()
    } catch (error) {
      setError('Falha ao criar o relatório')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  function handleClose() {
    router.back()
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
      hours: Number(hours),
      minutes: Number(minutes),
      students: Number(students),
      publications: Number(publications),
      returnVisits: Number(returnVisits),
      videos: Number(videos),
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
    const unmountData = (report: ReportData) => {
      setpublications(report.publications)
      setstudents(report.students)
      setvideos(report.videos)
      setreturnVisits(report.returnVisits)
      setminutes(report.minutes)
      setHours(report.hours)
      setDate(new Date(report.createdAt))
      setComents(report.comments)
    }
    async function get_report_by_id(id: string) {
      try {
        const report = await GET_REPORT_BY_ID(id)
        unmountData(report)
      } catch (error) {
        console.log(error)
      } finally {
        setIsRendered(true)
      }
    }
    if (id) get_report_by_id(id)
    else setIsRendered(true)
  }, [id])
  return (
    <View className="flex-1 items-center px-6 justify-center bg-[#00000080]">
      <View
        className="w-full px-4 bg-white rounded-md"
        style={{
          backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
          borderRadius: 10,
        }}
      >
        <View>
          {isRendered ? (
            <DatePicker date={date} setDate={setDate} />
          ) : (
            <View
              className="w-full h-10 mb-4 mt-5 rounded"
              style={{ backgroundColor: isDark ? '#464645' : '#f5f5f5' }}
            />
          )}

          <ViewWithLoad isRendered={isRendered}>
            <View className="flex-row w-auto mb-3">
              <FormInput
                value={hours}
                change={handleChange(setHours)}
                decrementValue={decHours}
                inCrementValue={InCHours}
                title="Horas"
              />
              <FormInput
                value={minutes}
                change={handleChangeMinuts}
                decrementValue={decMinutes}
                inCrementValue={InCMinutes}
                title="Minutos"
                style={{ marginLeft: 20 }}
              />
            </View>
          </ViewWithLoad>

          <ViewWithLoad isRendered={isRendered}>
            <View className="flex-row w-auto mb-3">
              <FormInput
                value={publications}
                change={handleChange(setpublications)}
                decrementValue={decPublications}
                inCrementValue={incPublications}
                title="Publicações"
              />
              <FormInput
                value={videos}
                change={handleChange(setvideos)}
                decrementValue={decVideos}
                inCrementValue={incVideos}
                title="Videos"
                style={{ marginLeft: 20 }}
              />
            </View>
          </ViewWithLoad>

          <ViewWithLoad isRendered={isRendered}>
            <View className="flex-row w-auto mb-3">
              <FormInput
                value={students}
                change={handleChange(setstudents)}
                decrementValue={decStudents}
                inCrementValue={incStudents}
                title="Estudos"
              />
              <FormInput
                change={handleChange(setreturnVisits)}
                decrementValue={decReturnVisits}
                inCrementValue={incReturnVisits}
                value={returnVisits}
                style={{ marginLeft: 20 }}
                title="Revisitas"
              />
            </View>
          </ViewWithLoad>

          <ViewWithLoad isRendered={isRendered}>
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
              color={isDark ? Colors.light.ligtInputbG : Colors.dark.background}
              inputStyle={{
                color: isDark
                  ? Colors.light.ligtInputbG
                  : Colors.dark.darkBgSecundary,
                fontFamily: 'IBMPLEX_Regular',
              }}
              className="bg-ligtInputbG font-textIBM text-sm w-full h-[80px] pl-3 pr-1 rounded-xl"
            />
          </ViewWithLoad>
        </View>
        <View
          style={{
            backgroundColor: isDark ? Colors.dark.darkBgSecundary : 'white',
          }}
        >
          <DialogActions className="mt-6 flex-row justify-between">
            <Button
              onPress={handleClose}
              title="Cancel"
              variant="contained"
              color="#FF647C"
              className="font-text capitalize text-white"
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
        </View>
        {error && <Text className="mt-1 ml-1 text-red-600">{error}</Text>}
      </View>
    </View>
  )
}
