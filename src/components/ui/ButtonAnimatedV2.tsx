import React from 'react';
import {
  StyleSheet,
  type TouchableOpacityProps,
  Platform,
  type ViewStyle,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { Text } from '../Themed';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Props extends TouchableOpacityProps {
  text: string;
}

export function AnimatedButtonWithText({ onPress, text, ...rest }: Props) {
  const { isDark } = useTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.floatingContainer, animatedStyle]}>
        <AnimatedTouchable
          onPress={onPress}
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            },
          ]}
          {...rest}
        >
          <Text
            lightColor="white"
            darkColor="white"
            className="font-textIBM text-base text-white"
          >
            {text}
          </Text>
          <Ionicons color="white" name="add" size={20} />
        </AnimatedTouchable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 13,
    right: 22,
    zIndex: 100,
  },
  button: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  } as ViewStyle,
});
