import { Text } from '@/components/ui/text';
import { requireNativeView } from 'expo';
import type { Ref } from 'react';
import { Platform, View, type NativeSyntheticEvent, type ViewProps } from 'react-native';

export type NotesEditorViewRef = {
  getDocument: () => Promise<string | null>;
  getTitle: () => Promise<string | null>;
};

type NotesEditorViewProps = ViewProps & {
  ref?: Ref<NotesEditorViewRef>;
  documentId: string;
  initialDocument: string;
  initialTitle: string;
  editable?: boolean;
  placeholder?: string;
  students?: string;
  tags?: string;
  foregroundColor?: string;
  mutedColor?: string;
  primaryColor?: string;
  surfaceColor?: string;
  cardColor?: string;
  dividerColor?: string;
  destructiveColor?: string;
  onDocumentChange?: (event: NativeSyntheticEvent<{ document: string }>) => void;
  onTitleChange?: (event: NativeSyntheticEvent<{ title: string }>) => void;
  onReference?: (event: NativeSyntheticEvent<{ kind: 'student' | 'tag'; id: string }>) => void;
};

const NativeNotesEditorView =
  Platform.OS === 'android' ? requireNativeView<NotesEditorViewProps>('Notes', 'NotesEditorView') : null;

export function NotesEditorView(props: NotesEditorViewProps) {
  if (!NativeNotesEditorView) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text variant="bodyM" className="text-center text-muted-foreground">
          O editor de notas só está disponível no Android.
        </Text>
      </View>
    );
  }
  return <NativeNotesEditorView {...props} />;
}
