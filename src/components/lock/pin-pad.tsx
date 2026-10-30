import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { PIN_LENGTH } from '@/utils/lock';
import * as React from 'react';
import { Pressable, Vibration, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type PinPadProps = {
  onComplete: (pin: string) => void;
  // Muda a cada erro: limpa os pontos e abana.
  errorKey?: number;
  disabled?: boolean;
  onBiometric?: () => void;
};

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

function PinPad({ onComplete, errorKey = 0, disabled, onBiometric }: PinPadProps) {
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState(false);
  const shake = useSharedValue(0);

  React.useEffect(() => {
    if (errorKey === 0) return;
    setPin('');
    setError(true);
    Vibration.vibrate(120);
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, [errorKey, shake]);

  const dotsStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const press = (digit: string) => {
    if (disabled || pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setError(false);
    setPin(next);
    if (next.length === PIN_LENGTH) {
      // Deixa ver o 4.º ponto antes de limpar.
      setTimeout(() => {
        setPin('');
        onComplete(next);
      }, 120);
    }
  };

  const erase = () => {
    if (disabled) return;
    setPin((current) => current.slice(0, -1));
  };

  return (
    <View className="w-full items-center gap-8">
      <Animated.View
        role="img"
        aria-label={`${pin.length} de ${PIN_LENGTH} dígitos`}
        className="flex-row gap-5"
        style={dotsStyle}>
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <View
            key={index}
            className={cn(
              'size-4 rounded-full border-[1.5px]',
              error
                ? 'border-destructive bg-destructive'
                : index < pin.length
                  ? 'border-primary bg-primary'
                  : 'border-subtle'
            )}
          />
        ))}
      </Animated.View>

      <View role="group" aria-label="Teclado numérico" className="w-full flex-row flex-wrap gap-y-2">
        {DIGITS.map((digit) => (
          <Key key={digit} label={digit} disabled={disabled} onPress={() => press(digit)} />
        ))}
        {onBiometric ? (
          <Key
            accessibilityLabel="Usar impressão digital"
            icon="fingerprint"
            ghost
            disabled={disabled}
            onPress={onBiometric}
          />
        ) : (
          <View className="h-16 w-1/3 px-1" />
        )}
        <Key label="0" disabled={disabled} onPress={() => press('0')} />
        <Key
          accessibilityLabel="Apagar"
          icon="backspace"
          ghost
          disabled={disabled || pin.length === 0}
          onPress={erase}
        />
      </View>
    </View>
  );
}

type KeyProps = {
  label?: string;
  icon?: 'fingerprint' | 'backspace';
  accessibilityLabel?: string;
  ghost?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

function Key({ label, icon, accessibilityLabel, ghost, disabled, onPress }: KeyProps) {
  return (
    <View className="h-16 w-1/3 px-1">
      <Pressable
        role="button"
        accessibilityLabel={accessibilityLabel ?? label}
        disabled={disabled}
        onPress={onPress}
        className={cn(
          'flex-1 items-center justify-center rounded-lg disabled:opacity-40',
          ghost ? 'active:bg-secondary' : 'bg-card active:bg-secondary'
        )}>
        {icon ? (
          <AppIcon name={icon} size={26} className="text-primary" />
        ) : (
          <Text className="font-display-semibold text-[25px] leading-8">{label}</Text>
        )}
      </Pressable>
    </View>
  );
}

export { PinPad };
