import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { useState, useCallback } from 'react';

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedButton({
  onPress,
  isLoading,
}: TouchableOpacityProps & { isLoading?: boolean }) {
  const { isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: positionY.value },
        { translateX: positionX.value },
      ],
    };
  });

  const handlePress = useCallback(
    (event: any) => {
      if (isPressed || isLoading || !onPress) return;

      setIsPressed(true);
      onPress(event);

      // Reset do estado após um delay para permitir a ação ser processada
      setTimeout(() => setIsPressed(false), 500);
    },
    [onPress, isPressed, isLoading]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // No-op, handled in onUpdate
    })
    .onUpdate((event) => {
      positionY.value = event.translationY;
      positionX.value = event.translationX;
    })
    .onEnd(() => {
      positionY.value = withSpring(0);
      positionX.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={panGesture}>
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
          onPress={handlePress}
          style={[
            styles.button,
            {
              backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
            },
          ]}
          disabled={isLoading || isPressed}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons color="white" name="add" size={32} />
          )}
        </ButtonAnimated>
      </Animated.View>
    </GestureDetector>
  );
}
