import TouchableOpacity, { Text, View } from '@/components/Themed';
import { useForm } from 'react-hook-form';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type Student, studentsAction } from '@/database/actions';
import Snackbar from 'react-native-snackbar';
import { SchemaStudents } from '@/utils/validations/create-student';
import { BackButton } from '@/components/ui/BackButton';
import type { z } from 'zod';
import { TextInputForm } from '@/components/ui/TextInputForm';

import Person from '@/assets/images/Person.svg';
import Woman from '@/assets/images/Woman.svg';

interface Age {
  age: string;
  state: boolean;
}

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
  const { push } = useRouter();

  const data: Student = useLocalSearchParams() as unknown as Student;

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
          address: data?.address || '',
        }
      : {},
  });

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

  async function handleValidate() {
    return await trigger();
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

  function transformeData(data: SchemaStudentsType) {
    const body: Omit<Student, 'id' | 'createdAt'> = {
      about: data.about || '',
      address: data.address || '',
      age: data.age,
      email: data.email || '',
      gender: data.gender || 'man',
      name: data.name || '',
      telephone: data?.telephone ? data.telephone : '',
    };
    return { body };
  }

  const onSubmit = async (databody: SchemaStudentsType) => {
    const isValid = await handleValidate();
    if (!isValid) {
      return;
    }
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
        push({
          pathname: '/(drawer)/(tabs)/students/add-student/availability',
          params: { data: JSON.stringify(studentData) },
        });
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
              Morador (Informações de Contato)
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
        <TextInputForm
          height
          control={control}
          errors={errors}
          label="Nome"
          name="name"
          placeholder="Nome do Morador"
          rules={{}}
        />
        <TextInputForm
          control={control}
          errors={errors}
          label="Telefone (Opcional)"
          name="telephone"
          placeholder="+258"
          rules={{}}
          keyboardType="number-pad"
          height
        />
        <TextInputForm
          control={control}
          errors={errors}
          label="Email (Opcional)"
          name="email"
          placeholder="fulano@gmail.com"
          keyboardType="email-address"
          rules={{}}
          height
        />
        <View className="mt-4 flex-1" lightColor="transparent">
          <Text className="text-sm font-normal font-text">Idade</Text>
          <View
            className="flex-1 flex-row flex-wrap gap-2 mt-2"
            lightColor="transparent"
          >
            {ages.map((age: Age, index: number) => {
              const backgroundColor = age.state
                ? isDark
                  ? Colors.dark.tint
                  : Colors.light.tint
                : isDark
                ? Colors.dark.darkBgSecundary
                : Colors.light.inputBg;

              const color = age.state
                ? 'white'
                : isDark
                ? '#a3afb73f'
                : '#252525';
              return (
                <TouchableOpacity
                  onPress={() => handleChangeAge(index)}
                  key={age.age}
                  style={{
                    backgroundColor,
                  }}
                  className="w-14 h-[47px] items-center justify-center bg-violet-200 rounded-lg"
                >
                  <Text
                    style={{
                      color,
                    }}
                    className="text-sm font-normal font-text"
                  >
                    {age.age}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors?.age?.message && (
            <Text lightColor="red" darkColor="red" className="text-[12px] ml-2">
              {errors?.age?.message}
            </Text>
          )}
        </View>
        <View className="mt-4 flex-1 mb-4" lightColor="transparent">
          <Text className="text-sm font-normal font-text">Genero</Text>
          <View
            className="flex-1 flex-row flex-wrap gap-2 mt-2"
            lightColor="transparent"
          >
            <TouchableOpacity
              darkColor={gender.man ? Colors.dark.tint : '#FBEEBC'}
              lightColor={gender.man ? Colors.light.tint : ''}
              onPress={() => handleChangeGender('man')}
              className="w-16 h-16 mr-2 rounded-3xl flex items-center justify-center"
            >
              <Person width={48} height={48} />
            </TouchableOpacity>
            <TouchableOpacity
              darkColor={gender.woman ? Colors.dark.tint : '#FBEEBC'}
              lightColor={gender.woman ? Colors.light.tint : ''}
              onPress={() => handleChangeGender('woman')}
              className="w-16 h-16 mr-2 rounded-3xl flex items-center justify-center"
            >
              <Woman width={48} height={48} />
            </TouchableOpacity>
          </View>
          {errors?.gender?.message && (
            <Text lightColor="red" darkColor="red" className="text-[12px] ml-2">
              {errors?.gender?.message}
            </Text>
          )}
        </View>
        <View className="mb-4 flex-1">
          <TextInputForm
            placeholder="O que você gostaria de adicionar?"
            control={control}
            errors={errors}
            label="Informacoes Adicionais"
            name="about"
            rules={{}}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        <View className="mb-4 flex-1">
          <TextInputForm
            control={control}
            errors={errors}
            label="Localização"
            name="address"
            placeholder="Avenida de Maputo"
            rules={{}}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.7}
            disabled={isSubmitting}
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
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
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
