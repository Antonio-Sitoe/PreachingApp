import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

export default function ModalScreen() {
  const { isDark } = useTheme()
  return (
    <View
      className="flex-1 pt-8 px-4"
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
    >
      <Text style={styles.title} className="text-white">
        Modal
      </Text>
      <TextInput />
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
