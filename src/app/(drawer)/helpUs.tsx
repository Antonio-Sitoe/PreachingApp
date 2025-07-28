import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HelpUs() {
  return (
    <View>
      <Link href="/feedback">Feedback</Link>
      <Text>HelpUs</Text>
    </View>
  );
}
