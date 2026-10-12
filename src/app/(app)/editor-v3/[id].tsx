import { EditorV3Screen } from '@/components/editor-v3';
import { Stack } from 'expo-router';

export default function EditorV3DocumentScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditorV3Screen />
    </>
  );
}
