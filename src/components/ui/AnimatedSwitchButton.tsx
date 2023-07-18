import { Moon, Sun } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  Extrapolate,
  interpolateColor,
} from 'react-native-reanimated'

interface AnimatedSwitchButtonProps {
  onChange?: () => void
  value?: boolean
  toggleOffColor?: string
  toggleOnColor?: string
  height?: number
  width?: number
}

const SWITCH_BUTTON_PADDING = 4
const InterpolateXInput = [0, 1]

const AnimatedSwitchButton = ({
  value = false,
  toggleOffColor = '#c3c3c3',
  toggleOnColor = '#008ECC',
  height = 60,
  width = 250,
}: AnimatedSwitchButtonProps) => {
  const BUTTON_WIDTH = width
  const BUTTON_HEIGHT = height
  const SWITCH_BUTTON_AREA = 128
  const CUSTOM_HEIGHT = 50
  const CUSTOM_WIDTH = SWITCH_BUTTON_AREA - SWITCH_BUTTON_PADDING
  const [toggled, setToggled] = useState(value)
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const shareValue = useSharedValue(value ? 1 : 0)

  const containerScale = {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
  }

  const onChangeToggle = () => {
    setToggled(!toggled)
    toggleColorScheme()
  }

  const onPressSwitch = () => {
    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      })
    } else {
      shareValue.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      })
    }
    onChangeToggle()
  }

  const switchAreaStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            shareValue.value,
            InterpolateXInput,
            [0, BUTTON_WIDTH - SWITCH_BUTTON_AREA - 2 * SWITCH_BUTTON_PADDING],
            Extrapolate.CLAMP,
          ),
        },
      ],
      backgroundColor: interpolateColor(shareValue.value, InterpolateXInput, [
        toggleOffColor,
        toggleOnColor,
      ]),
    }
  })

  return (
    <TouchableOpacity
      onPress={onPressSwitch}
      activeOpacity={1}
      style={[styles.containerStyle, containerScale]}
      className="w-full bg-[#F0F0F0] rounded-full p-2 mt-2 h-[60px]"
    >
      <Animated.View
        className={`p-2 bg-white w-32 flex flex-row  items-center justify-center rounded-full`}
        style={[
          styles.switchButton,
          {
            height: CUSTOM_HEIGHT,
            width: CUSTOM_WIDTH,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          },
          switchAreaStyles,
        ]}
      >
        {colorScheme === 'dark' ? (
          <Moon size={24} color="#535763" />
        ) : (
          <Sun size={24} color="#535763" />
        )}
        <Animated.Text className="ml-2 text-[#535763]">
          {colorScheme === 'dark' ? 'Escuro' : 'Claro'}{' '}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 500,
    borderColor: '#D8D8D8',
    borderWidth: 1,
  },
  switchButton: {
    backgroundColor: 'red',
    position: 'absolute',
    left: SWITCH_BUTTON_PADDING,
    borderRadius: 100,
  },
})

export { AnimatedSwitchButton }
