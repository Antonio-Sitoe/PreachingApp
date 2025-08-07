import { Stack } from 'expo-router';
import { HeaderSecondary } from '@/components/header-secondary';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        header() {
          return <HeaderSecondary />;
        },
      }}
    />
  );
}
