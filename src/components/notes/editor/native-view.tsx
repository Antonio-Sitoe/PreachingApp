import { Text } from '@/components/ui/text';
import { requireNativeView } from 'expo';
import type { Ref } from 'react';
import { Platform, View, type NativeSyntheticEvent, type ViewProps } from 'react-native';

export type NotesEditorViewRef = {
  getDocument: () => Promise<string | null>;
  getTitle: () => Promise<string | null>;
};

type Event<T> = (event: NativeSyntheticEvent<T>) => void;

export type NoteMetaField = 'tagId' | 'color' | 'studentId';

type NotesEditorViewProps = ViewProps & {
  ref?: Ref<NotesEditorViewRef>;
  documentId: string;
  initialDocument: string;
  initialTitle: string;
  editable?: boolean;
  placeholder?: string;
  theme: string;
  icons: string;
  noteColors: string;
  students: string;
  tags: string;
  tagId: string | null;
  color: string | null;
  studentId: string | null;
  stamp: string;
  saveStatus: 'saving' | 'saved';
  tagNameMax: number;
  tagsFeedback: string;
  onDocumentChange?: Event<{ document: string }>;
  onTitleChange?: Event<{ title: string }>;
  onReference?: Event<{ kind: 'student' | 'tag'; id: string }>;
  onBack?: Event<object>;
  onMetaChange?: Event<{ field: NoteMetaField; value: string | null }>;
  onDeleteNote?: Event<object>;
  onTagCreate?: Event<{ requestId: string; name: string }>;
  onTagRename?: Event<{ requestId: string; id: string; name: string }>;
  onTagDelete?: Event<{ id: string }>;
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
