import { NotesEditor } from '@/components/notes/editors';
import { Stack } from 'expo-router';

export default function NoteScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NotesEditor />
    </>
  );
}
