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

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity)

export function AnimatedButton({ onPress }: TouchableOpacityProps) {
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
          <Ionicons color="white" name="add" size={32} />
        </ButtonAnimated>
      </Animated.View>
    </PanGestureHandler>
  )
}
