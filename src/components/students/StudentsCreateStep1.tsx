import TouchableOpacity, { Text, View } from '@/components/Themed'
import { TextInputForm } from '@/components/ui/TextInputForm'

import Person from '@/assets/images/Person.svg'
import Woman from '@/assets/images/Woman.svg'
import Colors from '@/constants/Colors'

interface Age {
  age: string
  state: boolean
}

const StudentsCreateStep1 = ({
  ages,
  gender,
  control,
  errors,
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
          {ages.map((age: Age, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => handleChangeAge(index)}
                key={index}
                style={{
                  backgroundColor: age.state
                    ? Colors.light.tint
                    : Colors.light.inputBg,
                }}
                className="w-14 h-[47px] items-center justify-center bg-violet-200 rounded-lg"
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
        {errors?.age?.message && (
          <Text className="text-[12px] ml-2 text-red-600">
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
          <Text className="text-[12px] ml-2 text-red-600">
            {errors?.gender?.message}
          </Text>
        )}
      </View>
      <View className="mb-4 flex-1">
        <TextInputForm
          placeholder="Informacoes Adicionais"
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
    </>
  )
}

export { StudentsCreateStep1 }
