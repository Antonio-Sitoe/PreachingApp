import {
  Clock3,
  YoutubeIcon,
  LibraryIcon,
  User2,
  ListRestartIcon,
} from 'lucide-react-native'
import { StopWatch } from '@/components/StopWatch'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native'

import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import Cards from '@/components/Cards'
import CreateReportModal from '@/components/CreateReportModal'

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useQuery, useRealm } from '@realm/react'
import uuid from 'react-native-uuid'
import { User } from '@/database/schemas/User'

const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity)

export default function TabOneScreen() {
  const { isDark } = useTheme()
  const realm = useRealm()
  const query = useQuery(User)
  const [modalVisible, setModalVisible] = useState(false)

  const positionY = useSharedValue(0)
  const positionX = useSharedValue(0)
  const myCarButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: positionY.value },
        { translateX: positionX.value },
      ],
    }
  })

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value
      ctx.positionY = positionY.value
    },
    onActive(event, ctx: any) {
      positionY.value = event.translationY + ctx.positionY
      positionX.value = event.translationX + ctx.positionX
    },
    onEnd(_, ctx: any) {
      positionY.value = withSpring(0)
      positionX.value = withSpring(0)
    },
  })

  function handleAddReport() {
    setModalVisible(true)
  }

  function handleCreateUser() {
    console.clear()
    console.log(uuid.v4())
    realm.write(() => {
      realm.create('User', {
        _id: String(uuid.v4()),
        name: 'Antonio',
        bio: 'eu gosto de',
        avatar_image: 'sdsdsdsd',
        createdAt: new Date(),
        Profile: 'publicador',
      })
    })
  }
  function see() {
    console.clear()
    console.log(JSON.stringify(query))
  }
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
          paddingBottom: 80,
        }}
      >
        <View className="flex-1 pt-8 px-4" style={{ flex: 1 }}>
          <Button title="teste" onPress={handleCreateUser} />
          <Button title="ver" onPress={see} />
          <StopWatch />
          <Text
            style={{ color: isDark ? 'white' : Colors.light.tint }}
            className="text-center uppercase mt-9 mb-9 font-bold font-titleIBM text-primary dark:text-white"
          >
            Relatório do mês atual{' '}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards Icon={Clock3} content="6:00" title="Horas" />
            <Cards Icon={YoutubeIcon} content="2" title="Videos" />
          </View>
          <View
            style={{ flex: 1, width: 'auto', marginTop: 16, marginBottom: 16 }}
          >
            <Cards Icon={LibraryIcon} content="2" title="Publicações" />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 16 }}>
            <Cards Icon={User2} content="2" title="ESTUDOS" />
            <Cards Icon={ListRestartIcon} content="2" title="REVISITAS" />
          </View>
        </View>
      </ScrollView>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarButtonStyle,
            {
              position: 'absolute',
              bottom: 13,
              right: 22,
            },
          ]}
        >
          <ButtonAnimated
            onPress={handleAddReport}
            style={[
              styles.button,
              {
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              },
            ]}
          >
            <Ionicons color="white" name="add" size={32} />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
      <CreateReportModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  )
}
const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
