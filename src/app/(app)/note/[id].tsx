import { NoteEditor } from '@/components/notes/editor';
import { Stack } from 'expo-router';

export default function NoteScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteEditor />
    </>
  );
}
