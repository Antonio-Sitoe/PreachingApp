import { TouchableOpacity } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'
export function BackButton() {
  const { isDark } = useTheme()
  const { back } = useRouter()
  return (
    <TouchableOpacity onPress={back} activeOpacity={0.7}>
      <ChevronLeft
        size={45}
        color={isDark ? Colors.dark.tint : Colors.light.tint}
      />
    </TouchableOpacity>
  )
}
