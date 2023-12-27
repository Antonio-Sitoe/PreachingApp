import { Text, View } from '@/components/Themed'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { z } from 'zod'
import { BackButton } from '@/components/ui/BackButton'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { StudentsCreateStep1 } from '@/components/students/StudentsCreateStep1'
import { StudentsCreateStep2 } from '@/components/students/StudentsCreateStep2'
import { DialogActions, Button } from '@react-native-material/core'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { IStudentsBody } from '@/@types/interfaces'
import { CREATE_STUDENTS } from '@/database/actions/students/create'
import { Alert } from 'react-native'

const SchemaStudennts = z.object({
  name: z
    .string({
      required_error: 'Digite um nome',
    })
    .min(1, 'Digite um nome'),
  age: z.string({ required_error: 'Digite uma idade' }),
  gender: z.string({
    required_error: 'Escolha o genero',
  }),
  telephone: z.string().optional(),
  about: z.string().optional(),
  email: z.string().email('Digite um email valido').optional(),
  address: z.string().optional(),

  best_time: z
    .array(z.string(), {
      required_error: 'Escolha a melhor hora para visitar.',
    })
    .min(1, 'Escolha a melhor hora para visitar.'),
  best_day: z
    .array(z.string(), {
      required_error: 'Escolha um dia para visitar.',
    })
    .min(1, 'Escolha um dia para visitar.'),
})

const defaultAges = [
  {
    age: '5+',
    state: false,
  },
  {
    age: '10+',
    state: false,
  },
  {
    age: '15+',
    state: false,
  },
  {
    age: '20+',
    state: false,
  },
  {
    age: '30+',
    state: false,
  },
  {
    age: '50+',
    state: false,
  },
  {
    age: '-100',
    state: false,
  },
]

type SchemaStudenntsType = z.infer<typeof SchemaStudennts>
export default function CreateStudent() {
  const { isDark } = useTheme()
  const { back, push } = useRouter()
  const [step, setStep] = useState(false)
  const data: IStudentsBody = useLocalSearchParams()

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SchemaStudenntsType>({
    resolver: zodResolver(SchemaStudennts),
  })
  const [weekDays, setWeekDays] = useState<string[]>(data?.best_day || [])
  const [timesOfDay, settimeOfDay] = useState<string[]>(data?.best_time || [])
  const [gender, setGender] = useState({
    woman: data?.gender === 'woman',
    man: data?.gender === 'man',
  })
  const [ages, setAge] = useState(
    defaultAges.map((item) => {
      if (item.age === data?.age) {
        item.state = true
      }
      return item
    }),
  )

  async function handleNext() {
    try {
      const name = trigger('name')
      const age = trigger('age')
      const gender = trigger('gender')
      const validations = await Promise.all([name, age, gender])
      const isValid = validations.every((item) => item)
      if (isValid) {
        setStep(true)
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  function goBack() {
    setStep(false)
  }
  function cancel() {
    reset()
    back()
  }
  function handleChangeGender(genderParams: 'man' | 'woman') {
    const gender = genderParams === 'man' ? 'man' : 'woman'
    clearErrors('gender')
    setValue('gender', gender)
    setGender({
      man: genderParams === 'man',
      woman: genderParams === 'woman',
    })
  }

  function handleChangeAge(index: number) {
    clearErrors('age')
    const newAges = ages.map((age, i) => {
      return {
        ...age,
        state: i === index,
      }
    })
    setAge(newAges)
    const age = newAges.find((age) => age.state === true)
    if (age) {
      setValue('age', age?.age)
    }
  }

  function handleToogleWeekday(weekDayIndex: string) {
    clearErrors('best_day')
    console.log('weekDays', weekDays)
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(weekDays.filter((weekday) => weekday !== weekDayIndex))
      setValue(
        'best_day',
        weekDays.filter((weekday) => weekday !== weekDayIndex),
      )
    } else {
      setWeekDays((preview) => {
        return [...preview, weekDayIndex]
      })
      setValue('best_day', [...weekDays, weekDayIndex])
    }
  }
  function handleToogleTimeOfDay(time: string) {
    clearErrors('best_time')
    if (timesOfDay.includes(time)) {
      settimeOfDay(timesOfDay.filter((timeDay) => timeDay !== time))
      setValue(
        'best_time',
        timesOfDay.filter((timeDay) => timeDay !== time),
      )
    } else {
      settimeOfDay((preview) => {
        return [...preview, time]
      })
      setValue('best_time', [...timesOfDay, time])
    }
  }
  function transformeData(data: IStudentsBody) {
    const body: IStudentsBody = {
      about: data.about || '',
      address: data.address || '',
      age: data.age,
      best_day: data.best_day || [],
      best_time: data.best_time || [],
      email: data.email || '',
      gender: data.gender || 'man',
      name: data.name || '',
      telephone: data.telephone,
    }
    return { body }
  }

  const onSubmit = async (data: IStudentsBody | any) => {
    try {
      const { body } = transformeData(data)
      const newStudent = await CREATE_STUDENTS(body)
      console.log('newStudent', newStudent)
      if (newStudent) {
        push('/(report)/(tabs)/students')
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      if (data.telephone) setValue('telephone', `${data.telephone}`)
      if (data?.email) setValue('email', data?.email)
      setValue('age', data?.age)
      setValue('gender', data.gender)
      setValue('best_day', data.best_day)
      setValue('best_time', data.best_time)
      setValue('address', data.address)
    }
  }, [data, setValue])

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
              Morador{' '}
              {`${
                !step ? '(Informações de Contato)' : '(Informações de Serviço)'
              }`}
            </Text>
            <View
              darkColor={Colors.dark.tint}
              lightColor={Colors.light.tint}
              className="w-11 h-1 rounded-lg mt-2"
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
          paddingTop: 10,
        }}
      >
        {!step ? (
          <StudentsCreateStep1
            control={control}
            errors={errors}
            ages={ages}
            gender={gender}
            handleChangeAge={handleChangeAge}
            handleChangeGender={handleChangeGender}
          />
        ) : (
          <StudentsCreateStep2
            timesOfDay={timesOfDay}
            weekDays={weekDays}
            handleToogleTimeOfDay={handleToogleTimeOfDay}
            handleToogleWeekday={handleToogleWeekday}
            control={control}
            errors={errors}
          />
        )}

        {!step ? (
          <DialogActions>
            <Button
              title="Próximo"
              onPress={handleNext}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
              titleStyle={{
                color: 'white',
                fontFamily: 'Inter_400Regular',
                textTransform: 'capitalize',
              }}
            />
          </DialogActions>
        ) : (
          <DialogActions>
            <Button
              onPress={goBack}
              title="Voltar"
              variant="text"
              color="#FF647C"
              titleStyle={{
                color: '#252525',
                fontFamily: 'Inter_400Regular',
                textTransform: 'capitalize',
              }}
            />
            <Button
              title="Cancel"
              variant="contained"
              color="#FF647C"
              onPress={cancel}
              titleStyle={{
                color: 'white',
                fontFamily: 'Inter_400Regular',
                textTransform: 'capitalize',
              }}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              title="Guardar"
              variant="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
              titleStyle={{
                color: 'white',
                fontFamily: 'Inter_400Regular',
                textTransform: 'capitalize',
                marginHorizontal: 15,
              }}
            />
          </DialogActions>
        )}
      </ScrollView>
    </View>
  )
}
