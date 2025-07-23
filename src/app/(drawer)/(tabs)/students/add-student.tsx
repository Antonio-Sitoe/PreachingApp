import { Text, View } from '@/components/Themed';
import { useForm } from 'react-hook-form';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { StudentsCreateStep1 } from '@/components/students/StudentsCreateStep1';
import { StudentsCreateStep2 } from '@/components/students/StudentsCreateStep2';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type Student, studentsAction } from '@/database/actions';
import Snackbar from 'react-native-snackbar';
import { SchemaStudents } from '@/utils/validations/create-student';
import { BackButton } from '@/components/ui/BackButton';
import type { z } from 'zod';

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
];

type SchemaStudentsType = z.infer<typeof SchemaStudents>;

export default function CreateStudent() {
  const { isDark } = useTheme();
  const { back, push } = useRouter();
  const [step, setStep] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const data: Student = useLocalSearchParams() as unknown as Student;

  const weekDaysObj = data?.bestDay ? JSON.parse(data?.bestDay) : [];
  const timesOfDayObj = data?.bestTime ? JSON.parse(data?.bestTime) : [];

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SchemaStudentsType>({
    resolver: zodResolver(SchemaStudents),
    defaultValues: data?.id
      ? {
          name: data?.name || '',
          telephone: data?.telephone ? data.telephone : '',
          email: data?.email || '',
          about: data?.about || '',
          age: data?.age || '',
          gender: data.gender || 'man',
          bestDay: weekDaysObj,
          bestTime: timesOfDayObj,
          address: data?.address || '',
        }
      : {},
  });

  const [weekDays, setWeekDays] = useState<string[]>(weekDaysObj || []);
  const [timesOfDay, settimeOfDay] = useState<string[]>(timesOfDayObj || []);
  const [gender, setGender] = useState({
    woman: data?.gender === 'woman',
    man: data?.gender === 'man',
  });
  const [ages, setAge] = useState(
    defaultAges.map((item) => {
      if (data?.age && item.age === data?.age) {
        return { ...item, state: true };
      }
      return { ...item, state: false };
    })
  );

  async function handleNext() {
    try {
      const name = trigger('name');
      const age = trigger('age');
      const gender = trigger('gender');
      const validations = await Promise.all([name, age, gender]);
      const isValid = validations.every((item) => item);
      if (isValid) {
        setStep(true);
        scrollToTop();
      }
    } catch (error) {
      console.log('Error', error);
    }
  }
  function goBack() {
    setStep(false);
  }
  function cancel() {
    reset();
    back();
  }
  function handleChangeGender(genderParams: 'man' | 'woman') {
    const gender = genderParams === 'man' ? 'man' : 'woman';
    clearErrors('gender');
    setValue('gender', gender);
    setGender({
      man: genderParams === 'man',
      woman: genderParams === 'woman',
    });
  }
  function handleChangeAge(index: number) {
    clearErrors('age');
    const newAges = ages.map((age, i) => {
      return {
        ...age,
        state: i === index,
      };
    });
    setAge(newAges);
    const age = newAges.find((age) => age.state === true);
    if (age) {
      setValue('age', age?.age);
    }
  }
  function handleToogleWeekday(weekDayIndex: string) {
    clearErrors('bestDay');
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(weekDays.filter((weekday) => weekday !== weekDayIndex));
      setValue(
        'bestDay',
        weekDays.filter((weekday) => weekday !== weekDayIndex)
      );
    } else {
      setWeekDays((preview) => {
        return [...preview, weekDayIndex];
      });
      setValue('bestDay', [...weekDays, weekDayIndex]);
    }
  }
  function handleToogleTimeOfDay(time: string) {
    clearErrors('bestTime');
    if (timesOfDay.includes(time)) {
      settimeOfDay(timesOfDay.filter((timeDay) => timeDay !== time));
      setValue(
        'bestTime',
        timesOfDay.filter((timeDay) => timeDay !== time)
      );
    } else {
      settimeOfDay((preview) => {
        return [...preview, time];
      });
      setValue('bestTime', [...timesOfDay, time]);
    }
  }
  function transformeData(data: SchemaStudentsType) {
    const body: Omit<Student, 'id' | 'createdAt'> = {
      about: data.about || '',
      address: data.address || '',
      age: data.age,
      bestDay: data.bestDay ? JSON.stringify(data.bestDay) : null,
      bestTime: data.bestTime ? JSON.stringify(data.bestTime) : null,
      email: data.email || '',
      gender: data.gender || 'man',
      name: data.name || '',
      telephone: data?.telephone ? data.telephone : '',
    };
    return { body };
  }
  function scrollToTop() {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }
  const onSubmit = async (databody: SchemaStudentsType) => {
    try {
      const { body } = transformeData(databody);
      let studentData: any;
      if (data?.id) {
        studentData = await studentsAction.updateById(data.id, body);
      } else {
        studentData = await studentsAction.create(body);
      }
      Snackbar.show({
        text: `${data?.id ? 'atualizado o' : 'Adicionado'} ${body.name}`,
        duration: Snackbar.LENGTH_LONG,
      });
      if (studentData) {
        push('/(drawer)/(tabs)/students');
        reset();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

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
        ref={scrollViewRef}
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
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
          >
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.7}
              style={{
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                ...styles.button,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Inter_400Regular',
                  textTransform: 'capitalize',
                  fontSize: 14,
                }}
              >
                Próximo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
          >
            <TouchableOpacity
              onPress={goBack}
              activeOpacity={0.7}
              style={{
                backgroundColor: 'transparent',
                borderColor: '#FF647C',
                borderWidth: 1,
                ...styles.button,
              }}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  ...(isDark ? { color: 'white' } : { color: '#FF647C' }),
                }}
              >
                Voltar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancel}
              activeOpacity={0.7}
              style={{
                backgroundColor: '#FF647C',
                ...styles.button,
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.7}
              disabled={isSubmitting}
              style={{
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                opacity: isSubmitting ? 0.6 : 1,
                ...styles.button,
              }}
            >
              <Text
                style={{
                  ...styles.buttonText,
                }}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter_400Regular',
    textTransform: 'capitalize',
    fontSize: 14,
  },
});
