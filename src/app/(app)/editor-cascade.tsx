import { EditorCascadeScreen } from '@/components/editor-cascade';
import { Stack } from 'expo-router';

export default function EditorCascadeRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditorCascadeScreen />
    </>
  );
}
