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

const defaultValues = {
  firstName: '',
  lastName: '',
}

export default function CreateStudent() {
  const { isDark } = useTheme()
  const [step, setStep] = useState({ step: 0 })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const onSubmit = (data) => console.log(data)

  function handleNext() {
    setStep({ step: 1 })
  }

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <View
          className="flex-row items-center w-full justify-center"
          lightColor="#F6F6F9"
        >
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
              handleNext={handleNext}
            />
          ) : (
            <StudentsCreateStep2 control={control} errors={errors} />
          )}
        </ScrollView>
      </View>
    </View>
  )
}

const StudentsCreateStep2 = () => {
  return (
    <View>
      <Text>StudentsCreateStep2</Text>
    </View>
  )
}
const StudentsCreateStep1 = ({ control, errors, handleNext }) => {
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
    <>
      <TextInputForm
        height
        control={control}
        errors={errors}
        label="Nome"
        name="name"
        placeholder=""
        rules={{}}
      />
      <TextInputForm
        control={control}
        errors={errors}
        label="Telefone (Opcional)"
        name="cell"
        placeholder=""
        rules={{}}
        height
      />
      <TextInputForm
        control={control}
        errors={errors}
        label="Email (Opcional)"
        name="email"
        placeholder=""
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
        name="bio"
        placeholder=""
        rules={{}}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />
      <ButtonPrimary onPress={handleNext} text="Proximo" width="150px" />
    </>
  )
}
