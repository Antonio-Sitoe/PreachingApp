import { LIGHT_THEME_VARS } from '@/lib/theme';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function WelcomeLayout() {
  return (
    <View className="flex-1" style={LIGHT_THEME_VARS}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
