import { EditorV3DocumentList } from '@/components/editor-v3';
import { Stack } from 'expo-router';

export default function EditorV3ListScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditorV3DocumentList />
    </>
  );
}
