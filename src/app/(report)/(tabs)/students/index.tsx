import { IStudentsBody } from '@/@types/interfaces'
import NoContent from '@/components/NoContent'
import { Text, View } from '@/components/Themed'
import { StudentCard } from '@/components/students/StudentCard'
import { AnimatedButtonWithText } from '@/components/ui/ButtonAnimatedV2'
import Colors from '@/constants/Colors'
import { GET_STUDENT_DATA } from '@/database/actions/students/read'

import useTheme from '@/hooks/useTheme'
import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { RefreshControl, ScrollView } from 'react-native-gesture-handler'

interface Idata extends IStudentsBody {
  id: string
  name: string
  address: string
}

export default function StudentsHome() {
  const router = useRouter()
  const { isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [people, setPeople] = useState<Idata[]>([])
  const isFocused = useIsFocused()

  function handleAddPeople() {
    router.push('/(report)/(tabs)/students/createStudents')
  }
  async function listStudents() {
    try {
      setIsLoading(true)
      const students = await GET_STUDENT_DATA()
      setPeople(students as Idata[])
      console.log(students)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFocused) {
      listStudents()
    }
  }, [isFocused])

  return (
    <View className="flex-1 px-4" style={{ flex: 1 }} lightColor="#F6F6F9">
      <View className="my-3 mt-6 flex items-center" lightColor="transparent">
        <Text className="font-subTitleIBM text-base">
          MORADORES, INTERESSADOS E ESTUDANTES
        </Text>
        <View
          darkColor={Colors.dark.tint}
          lightColor={Colors.light.tint}
          className="w-11 h-1 mx-auto rounded-lg mt-2"
        />
      </View>

      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={listStudents}
            colors={[Colors.dark.tint]}
          />
        }
        data={people}
        estimatedItemSize={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
          paddingTop: 20,
        }}
        keyExtractor={(item, i) => i + String(item.id)}
        ListEmptyComponent={() => {
          return (
            <View className="mt-10">
              <NoContent text="Sem dados" />
            </View>
          )
        }}
        renderItem={({ item }) => {
          return (
            <StudentCard
              onViewProfile={() => {
                router.push({
                  pathname: '/(report)/(tabs)/students/profile',
                  params: { id: item.id },
                })
              }}
              onAddVisit={() => {
                router.push({
                  pathname: '/(report)/(tabs)/students/createVisit',
                  params: { id: item.id, name: item?.name },
                })
              }}
              data={item}
            />
          )
        }}
      />

      <AnimatedButtonWithText
        text="Adicionar Pessoa"
        onPress={handleAddPeople}
      />
    </View>
  )
}
