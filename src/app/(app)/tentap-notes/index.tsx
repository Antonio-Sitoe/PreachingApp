import { TentapNotesList } from '@/components/10tap-editor';
import { Stack } from 'expo-router';

export default function TentapNotesScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TentapNotesList />
    </>
  );
}
