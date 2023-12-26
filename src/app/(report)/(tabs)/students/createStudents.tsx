import { Text, View } from '@/components/Themed'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { z } from 'zod'
import { BackButton } from '@/components/ui/BackButton'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { StudentsCreateStep1 } from '@/components/students/StudentsCreateStep1'
import { StudentsCreateStep2 } from '@/components/students/StudentsCreateStep2'
import { DialogActions, Button } from '@react-native-material/core'
import { useRouter } from 'expo-router'

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

  best_time: z.array(z.string()).optional(),
  best_day: z.array(z.string()).optional(),
})

type SchemaStudenntsType = z.infer<typeof SchemaStudennts>
export default function CreateStudent() {
  const { isDark } = useTheme()
  const { back } = useRouter()
  const [step, setStep] = useState(false)

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<SchemaStudenntsType>({
    resolver: zodResolver(SchemaStudennts),
    delayError: 200,
  })
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [timesOfDay, settimeOfDay] = useState<string[]>([])
  const [gender, setGender] = useState({
    woman: false,
    man: false,
  })
  const [ages, setAge] = useState([
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
  ])

  async function handleNext() {
    try {
      const isValid = await trigger()
      console.log('Trigger', isValid)
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
    if (timesOfDay.includes(time)) {
      settimeOfDay(timesOfDay.filter((timeDay) => timeDay !== time))
    } else {
      settimeOfDay((preview) => {
        return [...preview, time]
      })
    }
  }

  const onSubmit = (data) => console.log(data)

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
                step ? '(Informações de Contato)' : '(Informações de Serviço)'
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
              loading={false}
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
