import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import useTheme from '@/hooks/useTheme';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const { isDark } = useTheme();
  const { back } = useRouter();

  function handlePress() {
    if (onPress) {
      onPress();
    } else {
      back();
    }
  }
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ChevronLeft
        size={45}
        color={isDark ? Colors.dark.tint : Colors.light.tint}
      />
    </TouchableOpacity>
  );
}
