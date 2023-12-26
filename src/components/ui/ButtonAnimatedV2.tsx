import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { Text } from '../Themed'

const styles = StyleSheet.create({
  button: {
    height: 45,
    boxShadow: 5,
    borderRadius: 10,
    paddingHorizontal: 15,
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity)

interface Props extends TouchableOpacityProps {
  text: string
}

export function AnimatedButtonWithText({ onPress, text }: Props) {
  const { isDark } = useTheme()
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
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        className="shadow-lg"
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
          onPress={onPress}
          style={[
            styles.button,
            {
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            },
          ]}
        >
          <Text className="font-textIBM text-base text-white">{text}</Text>
          <Ionicons color="white" name="add" size={20} />
        </ButtonAnimated>
      </Animated.View>
    </PanGestureHandler>
  )
}
