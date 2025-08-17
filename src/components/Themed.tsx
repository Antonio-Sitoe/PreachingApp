/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

// biome-ignore assist/source/organizeImports:IMPORTANT
import {
  TouchableOpacity as DefaultTouchableOpacity,
  type Text as DefaultText,
  View as DefaultView,
  type TouchableOpacityProps,
} from 'react-native';

import { useColorScheme } from 'nativewind';
import Colors from '@/constants/Colors';
import { forwardRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TouchebleProps = ThemeProps &
  React.ComponentProps<typeof DefaultTouchableOpacity> &
  TouchableOpacityProps;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme().colorScheme ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemedTextProps = RNTextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <RNText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const ligth = lightColor || 'transparent';
  const backgroundColor = useThemeColor(
    { light: ligth, dark: darkColor },
    'background'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

function TouchableOpacity(props: TouchebleProps, ref) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <DefaultTouchableOpacity
      ref={ref}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export default forwardRef(TouchableOpacity);
