import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

export default function TabOneScreen() {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-stone-900">
        <Text className="dark:text-primary">Tab One</Text>
      </View>
    </>
  )
}
