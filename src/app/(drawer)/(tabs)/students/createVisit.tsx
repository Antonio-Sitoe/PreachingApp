import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from '@/components/Themed';
import { BackButton } from '@/components/ui/BackButton';
import { DatePicker } from '@/components/ui/DatePicker';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextInputForm } from '@/components/ui/TextInputForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { type IVisit, visitsAction } from '@/database/actions';

import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import Snackbar from 'react-native-snackbar';
import dayjs from 'dayjs';
import { createVisitSchema } from '@/utils/validations/create-visit';
import type z from 'zod';

export default function CreateVisit() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [load, setLoad] = useState(false);
  const { id, name, visitID } = useLocalSearchParams() as {
    id: string;
    name: string;
    visitID: string;
  };
  const [date, setDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      studentsId: id ?? '',
      notes: '',
      publications: '',
      biblicalTexts: '',
      result: 'attended',
      dateAndHours: date,
    },
  });

  const onSubmit = async (data: z.infer<typeof createVisitSchema>) => {
    try {
      const dateformated = dayjs(date).format('DD/MM/YYYY');
      const visitData: Omit<IVisit, 'id'> = {
        studentsId: data.studentsId,
        notes: data.notes,
        publications: data.publications,
        biblicalTexts: data.biblicalTexts,
        result: data.result,
        dateAndHours: dateformated,
        createdAt: dayjs().format('DD/MM/YYYY'),
      };
      console.log('[DATA TO SEND]', visitData);
      let newVisit: IVisit;
      if (visitID) {
        newVisit = await visitsAction.updateById(visitID as string, visitData);
      } else {
        newVisit = await visitsAction.create(visitData);
      }
      console.log('[NOVA VISITA]', newVisit);
      Snackbar.show({
        text: `Visita ${visitID ? 'atualizada' : 'adicionada'} a  ${name}`,
        duration: Snackbar.LENGTH_LONG,
      });
      if (newVisit) {
        router.push({
          pathname: '/(drawer)/(tabs)/students/profile',
          params: { id },
        });
      }
    } catch (error) {
      console.log('[ERROR] : ', error);
    }
  };

  useEffect(() => {
    async function loadVisitData(visitID: string | string[]) {
      setLoad(true);
      const visit = await visitsAction.getById(visitID as string);
      if (!visit) {
        setLoad(false);
        return;
      }
      setDate(
        visit.dateAndHours
          ? dayjs(
              new Date(visit.dateAndHours.split('/').reverse().join('-')),
              'DD/MM/YYYY'
            ).toDate()
          : new Date()
      );
      setValue('biblicalTexts', visit.biblicalTexts ?? '');
      setValue(
        'dateAndHours',
        visit.dateAndHours
          ? dayjs(
              new Date(visit.dateAndHours.split('/').reverse().join('-')),
              'DD/MM/YYYY'
            ).toDate()
          : new Date()
      );
      setValue('notes', visit.notes ?? '');
      setValue('publications', visit.publications ?? '');
      setValue('result', visit?.result ?? '');
      setLoad(false);
    }
    if (visitID) {
      loadVisitData(visitID);
    }
  }, [visitID, setValue]);

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center gap-2"
          lightColor="#F6F6F9"
        >
          <BackButton />
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over items-center gap-2">
              Visita ao Morador {name ? `(${name})` : ''}
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
          {load && <ActivityIndicator />}
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
            label="Textos bíblicos"
            name="biblicalTexts"
            placeholder="Textos bíblicos"
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
            label="O que dizer da próxima vez?"
            name="notes"
            placeholder="O que dizer da próxima vez?"
            rules={{}}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          <View className="my-2" />
          <View className="flex-row justify-end">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={{
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 32,
                opacity: isSubmitting ? 0.5 : 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                className="text-white font-bold text-base"
                lightColor="white"
                darkColor="white"
              >
                Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
