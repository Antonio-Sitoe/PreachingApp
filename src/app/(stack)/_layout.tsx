import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="feedback"
        options={{
          title: 'feedback',
        }}
      />
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
