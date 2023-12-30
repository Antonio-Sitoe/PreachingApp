import { Select } from '@/components/ui/Select'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Text, View } from '@/components/Themed'
import { BackButton } from '@/components/ui/BackButton'
import { DatePicker } from '@/components/ui/DatePicker'
import { zodResolver } from '@hookform/resolvers/zod'

import { TextInputForm } from '@/components/ui/TextInputForm'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button, DialogActions } from '@react-native-material/core'
import { CREATE_VISIT_BY_STUDENT_ID } from '@/database/actions/visits/create'

import * as z from 'zod'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Snackbar from 'react-native-snackbar'
import dayjs from 'dayjs'

const schema = z.object({
  date_and_hours: z.date({
    required_error: 'Digite uma data',
  }),
  students_id: z.string(),
  result: z.string(),
  biblical_texts: z.string(),
  publications: z.string(),
  videos: z.string(),
  notes: z.string(),
})

export default function CreateVisit() {
  const router = useRouter()
  const { isDark } = useTheme()
  const { id, name } = useLocalSearchParams()
  const [date, setDate] = useState(new Date())

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date_and_hours: date,
      students_id: id,
      result: 'attended',
      biblical_texts: '',
      publications: '',
      videos: '',
      notes: '',
    },
  })

  const onSubmit = async (data: any) => {
    try {
      const dateformated = dayjs(date).format('DD/MM/YYYY')
      data.date_and_hours = dateformated
      console.log('[DATA TO SEND]', data)
      const newVisit = await CREATE_VISIT_BY_STUDENT_ID(data)
      console.log('[NOVA VISITA]', newVisit)
      Snackbar.show({
        text: 'Visita adicionada a ' + name,
        duration: Snackbar.LENGTH_LONG,
      })
      if (newVisit) {
        router.push({
          pathname: '/(report)/(tabs)/students/profile',
          params: { id },
        })
      }
    } catch (error) {
      console.log('[ERROR] : ', error)
    }
  }
  console.log('isSubmitSuccessful', isSubmitSuccessful)

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center gap-2"
          lightColor="#F6F6F9"
        >
          <BackButton />
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over">
              Visita ao Morador ({name})
            </Text>
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-11 h-1 rounded-lg mt-2"
            />
          </View>
        </View>
      </View>
      <View className="flex-1" lightColor="transparent">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
            paddingBottom: 60,
            paddingTop: 5,
          }}
        >
          <DatePicker date={date} setDate={setDate} />
          <Select
            label="Resultado"
            control={control}
            errors={errors}
            name="result"
            options={[
              {
                label: 'Esteve na visita',
                value: 'attended',
              },
              {
                label: 'Não estava em casa',
                value: 'not_at_home',
              },
              {
                label: 'Já não está interessada',
                value: 'no_longer_interested',
              },
              {
                label: 'Não tinha tempo',
                value: 'no_time',
              },
              {
                label: 'Ligou por telefone',
                value: 'called',
              },
            ]}
          />
          <TextInputForm
            height
            control={control}
            errors={errors}
            label="Textos biblicos"
            name="biblical_texts"
            placeholder="Textos biblicos"
            rules={{}}
          />
          <TextInputForm
            control={control}
            errors={errors}
            label="Publicações"
            name="publications"
            placeholder="Publicações"
            rules={{}}
            height
          />
          <TextInputForm
            control={control}
            errors={errors}
            label="Videos"
            name="videos"
            placeholder="Videos"
            rules={{}}
            height
          />

          <TextInputForm
            control={control}
            errors={errors}
            label="O que dizer da proxima vez?"
            name="notes"
            placeholder="O que dizer da proxima vez?"
            rules={{}}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          <View className="my-2" />
          <DialogActions>
            <Button
              title="Guardar"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              loadingIndicatorPosition="overlay"
              color={isDark ? Colors.dark.tint : Colors.light.tint}
              titleStyle={{
                color: 'white',
                fontFamily: 'Inter_400Regular',
                textTransform: 'capitalize',
              }}
            />
          </DialogActions>
        </ScrollView>
      </View>
    </View>
  )
}
