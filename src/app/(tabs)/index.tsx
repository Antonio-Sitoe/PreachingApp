import { StyleSheet } from 'react-native'
import Vector from '@/assets/images/Vector.svg'
import { Text, View } from '@/components/Themed'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useColorScheme } from 'nativewind'

export default function TabOneScreen() {
  const { toggleColorScheme } = useColorScheme()
  function handleChangeColorScheme() {
    toggleColorScheme()
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Text style={styles.title}>Tab One</Text>

      <TouchableOpacity
        onPress={handleChangeColorScheme}
        className="h-28 w-[150px] bg-slate-900"
      >
        <Text>Hello</Text>
      </TouchableOpacity>

      <Vector />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
