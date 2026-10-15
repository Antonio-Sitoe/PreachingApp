import { useOnboarding } from '@/contexts/onboarding';
import { LIGHT_THEME_VARS } from '@/lib/theme';
import { Stack } from 'expo-router';
import { View } from 'react-native';


export default function AuthLayout() {
  const { completed } = useOnboarding();

  return (
    <View className="flex-1" style={completed ? undefined : LIGHT_THEME_VARS}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
