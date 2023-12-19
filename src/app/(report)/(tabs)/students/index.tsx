import NoContent from '@/components/NoContent'
import { Text, View } from '@/components/Themed'
import { StudentCard } from '@/components/students/StudentCard'
import { AnimatedButtonWithText } from '@/components/ui/ButtonAnimatedV2'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { ScrollView } from 'react-native-gesture-handler'

export default function Students() {
  const router = useRouter()
  const { isDark } = useTheme()
  const [people, setPeople] = useState([1, 2, 3, 4, 5])

  function handleAddPeople() {}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 60,
          paddingTop: 20,
        }}
      >
        {people.length === 0 ? (
          <View className="mt-10">
            <NoContent text="Sem dados" />
          </View>
        ) : (
          <>
            {people.map((data, index) => {
              return (
                <StudentCard
                  onViewProfile={() => {
                    router.push('/(report)/(tabs)/students/profile')
                  }}
                  onAddVisit={() => {
                    router.push('/(report)/(tabs)/students/createVisit')
                  }}
                  data={data}
                  key={index}
                />
              )
            })}
          </>
        )}
      </ScrollView>
      <AnimatedButtonWithText
        text="Adicionar Pessoa"
        onPress={handleAddPeople}
      />
    </View>
  )
}
