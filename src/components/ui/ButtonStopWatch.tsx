import { IconIOS } from '@/assets/icons/Icon';
import { Text, TouchableOpacity } from 'react-native';

import useTheme from '@/hooks/useTheme';
import Colors from '@/constants/Colors';
import type { Ionicons } from '@expo/vector-icons';

interface IButtonStopWatchProps {
  onPress?: () => void;
  text: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  isSmallScreen?: boolean;
  isMediumScreen?: boolean;
}

export function ButtonStopWatch({
  onPress,
  text,
  iconName,
  isSmallScreen = false,
  isMediumScreen = false,
}: IButtonStopWatchProps) {
  const { isDark } = useTheme();

  const iconSize = isSmallScreen ? 28 : isMediumScreen ? 32 : 40;
  const buttonPadding = isSmallScreen ? 8 : isMediumScreen ? 10 : 12;
  const textSize = isSmallScreen ? 10 : isMediumScreen ? 11 : 12;
  const minWidth = isSmallScreen ? 60 : isMediumScreen ? 65 : 70;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: buttonPadding,
        minWidth: minWidth,
      }}
    >
      <IconIOS
        name={iconName}
        size={iconSize}
        color={isDark ? Colors.dark.text : Colors.light.tint}
      />
      <Text
        style={{
          color: isDark ? 'white' : Colors.light.tint,
          fontSize: textSize,
        }}
        className="font-textIBM text-primary dark:text-white"
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
