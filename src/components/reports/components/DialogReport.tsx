import { ReportData } from '@/@types/interfaces'
import { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import {
  Dialog,
  DialogHeader,
  DialogContent,
} from '@react-native-material/core'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export const DialogReport = ({ visible, setVisible, reports, onClick }) => {
  const { isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <DialogHeader
        title={
          <View className="w-full flex-1 flex-row justify-between">
            <Text className="font-subTitle text-lg">Editar relatório</Text>
            {isLoading && <ActivityIndicator />}
          </View>
        }
      />

      <DialogContent>
        <ScrollView
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
        >
          {reports?.map((item: ReportData, index: number) => {
            const date = dayjs(item.createdAt)
              .locale('pt-br')
              .format('dddd, D [de] MMMM [de] YYYY')
            return (
              <View
                key={index}
                lightColor="#c1e9e2"
                className="p-3 pt-0 rounded mb-2"
                darkColor={Colors.dark.darkBgSecundary}
              >
                <TouchableOpacity
                  className="mt-3"
                  onPress={async () => {
                    setIsLoading(true)
                    if (item.id) {
                      await onClick(item.id)
                    }
                    setIsLoading(false)
                  }}
                >
                  <Text
                    style={{
                      backgroundColor: isDark
                        ? Colors.dark.Success200
                        : Colors.light.tint,
                      color: isDark ? '#252525' : 'white',
                    }}
                    darkColor="black"
                    className="p-1 px-2 mb-1 rounded-lg"
                  >
                    {date}
                  </Text>
                  <Text className="ml-2">
                    {`${item.hours >= 10 ? item.hours : '0' + item.hours}:${
                      item.minutes >= 10 ? item.minutes : '0' + item.minutes
                    } horas, ${item.publications} publicações, ${
                      item.videos
                    } videos mostrados, ${item.returnVisits} revisitas, ${
                      item.students
                    } estudantes`}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      </DialogContent>
    </Dialog>
  )
}
