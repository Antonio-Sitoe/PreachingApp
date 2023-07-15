import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="presentation" />
      <Stack.Screen name="feedback" />
    </Stack>
  )
}
// Home                       Home
// Perfil ->                  Profile
// Apoiar ->                  help
// Politica-de-Privacidade->  privacity
// User Guide ->              UserGuide
// Ajuda e feedback ->        feedback
// Apresentacoes ->           presentation
// Definicoes->               settings
