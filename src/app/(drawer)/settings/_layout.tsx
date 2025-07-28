import { Stack } from 'expo-router';
import { Header } from '@/components/Header';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        header() {
          return <Header />;
        },
      }}
    />
  );
}
