import { useColorScheme } from 'nativewind'

export default function useTheme() {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  return { isDark, colorScheme }
}
