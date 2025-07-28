import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Variants
  
  // Sizes
  default: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  // Text styles
  text: {
    fontWeight: '500',
    fontSize: 16,
  },
  defaultText: {
    color: '#fafafa',
  },
  outlineText: {
    color: '#18181b',
  },
  ghostText: {
    color: '#18181b',
  },
  smText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 18,
  },
  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#a1a1aa',
  },
});
