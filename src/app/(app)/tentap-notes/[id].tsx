import { TentapNoteEditor } from '@/components/10tap-editor';
import { Stack } from 'expo-router';

export default function TentapNoteScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TentapNoteEditor />
    </>
  );
}
