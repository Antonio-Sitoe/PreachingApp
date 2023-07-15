import { StyleSheet, Text, View } from 'react-native'
import Vector from '@/assets/images/Vector.svg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useColorScheme } from 'nativewind'
import { Link } from 'expo-router'

export default function TabOneScreen() {
  const { toggleColorScheme } = useColorScheme()
  function handleChangeColorScheme() {
    toggleColorScheme()
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Text style={styles.title}>Tab One</Text>
      <Link href="/drawer/feedback" asChild>
        <TouchableOpacity className="h-28 w-[150px] bg-slate-900">
          <Text>Hello</Text>
        </TouchableOpacity>
      </Link>

      <Vector />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
