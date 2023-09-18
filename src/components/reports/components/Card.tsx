/* eslint-disable @typescript-eslint/ban-ts-comment */
import dayjs from 'dayjs'

import { Link } from 'expo-router'
import { Text, View } from '../../Themed'
import { ReportData } from '@/@types/interfaces'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { calculeTotalNumbers } from '@/utils/calculeTotalNumbers'

import Colors from '@/constants/Colors'
import React from 'react'

const Card = ({
  data,
  year,
  isDark,
}: {
  data: Array<[string, ReportData[]]>
  year: string
  isDark: boolean
}) =>
  data.map((report, index) => {
    const monthName = report[0] as string
    const listOfReports = report[1] as ReportData[]
    const { data } = calculeTotalNumbers(report[1])
    return (
      <View
        lightColor="#c1e9e2"
        darkColor={Colors.dark.darkBgSecundary}
        className="bg-[] p-2 mb-4 rounded-lg"
        key={index + Math.random() * 50}
      >
        <View
          style={{
            backgroundColor: isDark
              ? Colors.dark.Success200
              : Colors.light.tint,
          }}
          className="w-3 h-3 bg-indigo-500 rounded-full"
        />
        <View
          lightColor="#c1e9e2"
          darkColor={Colors.dark.darkBgSecundary}
          className="pl-5 pb-5 pr-2"
        >
          <View
            lightColor="#c1e9e2"
            darkColor={Colors.dark.darkBgSecundary}
            className="flex-row mb-1 gap-1 items-center"
          >
            <Text
              lightColor=""
              darkColor="#c1e9e2"
              className="font-title text-base capitalize"
            >
              {monthName}
            </Text>
            <Text lightColor="" darkColor="#c1e9e2" className="text-sm">
              ({year})
            </Text>
          </View>
          <Text lightColor="#504F4F" className="text-sm font-subTitle">
            {`${data.time} horas, ${data.publications} publicações, ${data.videos} Videos mostrados, ${data.returnVisits} revisitas, ${data.students} estudantes`}
          </Text>
          {listOfReports.map((item, index) => {
            const date = dayjs(item.createdAt)
              .locale('pt-br')
              .format('dddd, D [de] MMMM [de] YYYY')
            return (
              <Link
                key={item.id + ' ' + index}
                // @ts-ignore
                href={{
                  pathname: '/modal',
                  params: { id: item.id },
                }}
                asChild
              >
                <TouchableOpacity className="mt-3">
                  <Text
                    style={{
                      backgroundColor: isDark
                        ? Colors.dark.tint
                        : Colors.light.tint,
                      color: 'white',
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
              </Link>
            )
          })}
        </View>
      </View>
    )
  })

export default React.memo(Card)
