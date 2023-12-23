import TouchableOpacity, { Text, View } from '@/components/Themed'
import { TextInputForm } from '@/components/ui/TextInputForm'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { ButtonPrimary } from '@/components/ui/ButtonPrimary'

const defaultValues = {
  firstName: '',
  lastName: '',
}

export default function CreateVisit() {
  const { isDark } = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const onSubmit = (data) => console.log(data)

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center"
          lightColor="#F6F6F9"
        >
          <View className="flex-1" lightColor="transparent">
            <Text className="font-bold font-textIBM text-base break-words over">
              Visita ao Morador (Antonio Manuel Sitoe)
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
            paddingTop: 10,
          }}
        >
          <View lightColor="transparent" className="flex flex-1 flex-row gap-4">
            <View lightColor="transparent" className="flex flex-1 mt-4">
              <Text>Data</Text>
              <TouchableOpacity
                lightColor={Colors.light.inputBg}
                darkColor={Colors.dark.darkBgSecundary}
                className="h-12 rounded-lg mt-2 px-3 text-white"
                style={{
                  borderColor: isDark ? '#a3afb73f' : 'transparent',
                  borderWidth: isDark ? 1 : 0,
                }}
              />
            </View>
            <View lightColor="transparent" className="flex flex-1 mt-4">
              <Text>Horas</Text>
              <TouchableOpacity
                lightColor={Colors.light.inputBg}
                darkColor={Colors.dark.darkBgSecundary}
                className="h-12 rounded-lg mt-2 px-3 text-white"
                style={{
                  borderColor: isDark ? '#a3afb73f' : 'transparent',
                  borderWidth: isDark ? 1 : 0,
                }}
              />
            </View>
          </View>

          <TextInputForm
            height
            control={control}
            errors={errors}
            label="Textos biblicos"
            name="texts"
            placeholder=""
            rules={{}}
          />
          <TextInputForm
            control={control}
            errors={errors}
            label="Publicações"
            name="publications"
            placeholder=""
            rules={{}}
            height
          />
          <TextInputForm
            control={control}
            errors={errors}
            label="Videos"
            name="video"
            placeholder=""
            rules={{}}
            height
          />
          <TextInputForm
            control={control}
            errors={errors}
            label="O que dizer da proxima vez?"
            name="sayNext"
            placeholder=""
            rules={{}}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          <ButtonPrimary onPress={handleSubmit(onSubmit)} text="Guardar" />
        </ScrollView>
      </View>
    </View>
  )
}
