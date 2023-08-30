import { Text } from '@/components/Themed'
import { Stack } from 'expo-router'
export default function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(report)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerTitle(props) {
            return <Text>Relatorio</Text>
          },
        }}
      />
    </Stack>
  )
}
