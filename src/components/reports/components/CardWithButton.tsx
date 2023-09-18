/* eslint-disable @typescript-eslint/ban-ts-comment */
import dayjs from 'dayjs'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'

import { Pen } from 'lucide-react-native'
import { TouchableOpacity, View, Text } from '@/components/Themed'
import { Link } from 'expo-router'
import { memo } from 'react'

function CardWithButton({ data }) {
  const { isDark } = useTheme()
  const date = dayjs(data.createdAt)
    .locale('pt-br')
    .format('dddd, D [de] MMMM [de] YYYY')
  return (
    <View className="w-full mb-4">
      <View className="flex flex-row gap-2">
        <View
          lightColor="#c1e9e2"
          darkColor={Colors.dark.darkBgSecundary}
          className="p-2 pb-4 flex-1 rounded-lg shadow-lg"
        >
          <Text
            style={{
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              color: !isDark ? '#252525' : 'white',
            }}
            darkColor="black"
            className="p-1 px-2 mb-1 rounded-lg font-bold"
          >
            {date}
          </Text>
          <Text lightColor="#504F4F" className="text-sm pl-2 font-subTitle">
            {`${data.hours >= 10 ? data.hours : '0' + data.hours}:${
              data.minutes >= 10 ? data.minutes : '0' + data.minutes
            } horas, ${data.publications} publicações, ${
              data.videos
            } videos mostrados, ${data.returnVisits} revisitas, ${
              data.students
            } estudantes`}
          </Text>
        </View>
        <View className="w-[56px] flex flex-col">
          <Link
            // @ts-ignore
            href={{
              pathname: '/modal',
              params: { id: data.id },
            }}
            asChild
          >
            <TouchableOpacity className="w-full h-full bg-dark-tint rounded-lg flex items-center justify-center dark:bg-black">
              <Pen color="white" size={20} strokeWidth={1.5} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}
export default memo(CardWithButton)
