import TouchableOpacity, { Text, View } from '@/components/Themed'
import { TextInputForm } from '@/components/ui/TextInputForm'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'
import Person from '@/assets/images/Person.svg'
import Woman from '@/assets/images/Woman.svg'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { ButtonPrimary } from '@/components/ui/ButtonPrimary'
import { useState } from 'react'
import { CheckBox } from '@/components/ui/CheckBox'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BackButton } from '@/components/ui/BackButton'
// import { BackButton } from '@/components/ui/BackButton';

const SchemaStudennts = z.object({
  name: z.string().min(1),
  age: z.string().min(1),
  about: z.string().min(1),
  telephone: z.string().min(1),
  email: z.string().email(),
  gender: z.string().min(1),
  address: z.string().min(1),
  best_time: z.array(z.string()),
  best_day: z.array(z.string()),
  language: z.string().min(1),
})

export default function CreateStudent() {
  const { isDark } = useTheme()
  const [step, setStep] = useState({ step: 0 })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      age: '',
      about: '',
      telephone: '',
      email: '',
      gender: '',
      address: '',
      best_time: [],
      best_day: [],
      language: '',
      createdAt: '',
    },
  })

  const onSubmit = (data) => console.log(data)

  async function handleNext() {
    try {
      // setStep({ step: 1 })
      handleSubmit(onSubmit)
    } catch (error) {
      console.log('Error', error)
    }
  }

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

  function handleChangeGender(genderParams: 'man' | 'woman') {
    setGender({
      man: genderParams === 'man',
      woman: genderParams === 'woman',
    })
  }

  function handleChangeAge(index: number) {
    const newAges = ages.map((age, i) => {
      return {
        ...age,
        state: i === index,
      }
    })
    setAge(newAges)
  }

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
              Morador (Informacoes Contato)
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
          {step.step === 0 ? (
            <StudentsCreateStep1
              control={control}
              errors={errors}
              handleNext={handleSubmit(onSubmit)}
              ages={ages}
              gender={gender}
              handleChangeAge={handleChangeAge}
              handleChangeGender={handleChangeGender}
            />
          ) : (
            <StudentsCreateStep2 control={control} errors={errors} />
          )}
        </ScrollView>
      </View>
    </View>
  )
}

const StudentsCreateStep1 = ({
  ages,
  gender,
  control,
  errors,
  handleNext,
  handleChangeAge,
  handleChangeGender,
}) => {
  return (
    <>
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
          {ages.map((age, index) => {
            return (
              <TouchableOpacity
                onPress={() => handleChangeAge(index)}
                key={index}
                style={{
                  backgroundColor: age.state
                    ? Colors.light.tint
                    : Colors.light.inputBg,
                }}
                className="w-14 h-[47px] items-center justify-center bg-violet-200 rounded-lg border border-gray-100 border-opacity-25"
              >
                <Text
                  style={{
                    color: age.state ? 'white' : 'black',
                  }}
                  className="text-sm font-normal font-text"
                >
                  {age.age}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View className="mt-4 flex-1" lightColor="transparent">
        <Text className="text-sm font-normal font-text">Genero</Text>
        <View
          className="flex-1 flex-row flex-wrap gap-2 mt-2"
          lightColor="transparent"
        >
          <TouchableOpacity
            darkColor={Colors.dark.tint}
            lightColor={gender.man ? Colors.light.tint : ''}
            onPress={() => handleChangeGender('man')}
            className="w-16 h-16 mr-2 rounded-3xl flex items-center justify-center"
          >
            <Person width={48} height={48} />
          </TouchableOpacity>
          <TouchableOpacity
            darkColor="#FBEEBC"
            lightColor={gender.woman ? Colors.light.tint : ''}
            onPress={() => handleChangeGender('woman')}
            className="w-16 h-16 mr-2 rounded-3xl flex items-center justify-center"
          >
            <Woman width={48} height={48} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInputForm
        control={control}
        errors={errors}
        label="Informacoes Adicionais"
        name="about"
        rules={{}}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />
      <View className="w-40">
        <ButtonPrimary onPress={handleNext} text="Proximo" width="150px" />
      </View>
    </>
  )
}

const StudentsCreateStep2 = ({ control, errors }) => {
  return (
    <View className="flex-1" lightColor="transparent">
      <Text>Melhorar hora para vistar</Text>
      <View className="flex-1 flex-row justify-between mt-4 pb-2 border-b">
        <View className="flex-1" lightColor="transparent">
          <CheckBox title="Manha" />
          <CheckBox title="Final da tarde" />
        </View>
        <View className="flex-1" lightColor="transparent">
          <CheckBox title="Tarde" />
          <CheckBox title="Fim de semana" />
        </View>
      </View>
      <View
        className="flex-1 flex-row justify-between mt-4"
        lightColor="transparent"
      >
        <View className="flex-1" lightColor="transparent">
          <CheckBox title="Segunda feira" />
          <CheckBox title="Terça-feira" />
          <CheckBox title="Quarta-feira" />
          <CheckBox title="Quinta-feira" />
        </View>
        <View className="flex-1">
          <CheckBox title="Sexta-feira" />
          <CheckBox title="Sábado" />
          <CheckBox title="Domingo" />
        </View>
      </View>
      <TextInputForm
        control={control}
        errors={errors}
        label="Localização"
        name="bio"
        placeholder=""
        rules={{}}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />
      <View className="flex-row">
        <ButtonPrimary onPress={() => {}} text="Voltar" width="250px" />
        <ButtonPrimary onPress={() => {}} text="Salvar" width="250px" />
        <ButtonPrimary onPress={() => {}} text="Cancelar" width="100%" />
      </View>
    </View>
  )
}
