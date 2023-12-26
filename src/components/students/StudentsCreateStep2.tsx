import { Text, View } from '@/components/Themed'
import { TextInputForm } from '@/components/ui/TextInputForm'
import { CheckBox } from '@/components/ui/CheckBox'
import { Divider } from '@react-native-material/core'

const availableWeekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
]

const availableHours = ['Manhã', 'Tarde', 'Final da tarde', 'Fim de semana']

const StudentsCreateStep2 = ({
  control,
  errors,
  timesOfDay,
  weekDays,
  handleToogleWeekday,
  handleToogleTimeOfDay,
}) => {
  return (
    <>
      <Text className="text-sm font-normal font-text">
        Melhorar hora para vistar
      </Text>
      <View className="flex-1 flex-row justify-between pb-2 border-b-slate-500">
        <View
          className="flex-1 flex-row flex-wrap justify-between mt-2"
          lightColor="transparent"
        >
          {availableHours.map((time) => {
            return (
              <CheckBox
                key={time}
                title={time}
                checked={timesOfDay.includes(time)}
                onPress={() => handleToogleTimeOfDay(time)}
              />
            )
          })}
        </View>
      </View>
      <Divider />
      <View
        className="flex-1 flex-row flex-wrap justify-between mt-4"
        lightColor="transparent"
      >
        {availableWeekDays.map((weekDay) => {
          return (
            <CheckBox
              key={weekDay}
              title={weekDay}
              checked={weekDays.includes(weekDay)}
              onPress={() => handleToogleWeekday(weekDay)}
            />
          )
        })}
      </View>
      <View className="mb-4 flex-1">
        <TextInputForm
          control={control}
          errors={errors}
          label="Localização"
          name="address"
          placeholder=""
          rules={{}}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </>
  )
}

export { StudentsCreateStep2 }
