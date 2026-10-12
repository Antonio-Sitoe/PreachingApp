import { Text } from '@/components/ui/text';
import { requireNativeView } from 'expo';
import type { Ref } from 'react';
import { Platform, View, type NativeSyntheticEvent, type ViewProps } from 'react-native';

/** Métodos do editor nativo (AsyncFunction em EditorCascadeModule.kt). */
export type EditorCascadeViewRef = {
  /** Documento atual em JSON do Cascade, sem esperar pelo debounce do onDocumentChange. */
  getDocument: () => Promise<string | null>;
  /** Documento atual em Markdown (codec experimental do Cascade). */
  getMarkdown: () => Promise<string | null>;
};

export type EditorCascadeViewProps = ViewProps & {
  ref?: Ref<EditorCascadeViewRef>;
  /** Trocar o id reinicia o editor com o initialDocument; o resto do tempo o nativo é a fonte. */
  documentId: string;
  /** JSON gerado pelo próprio editor (onDocumentChange/getDocument). Vazio = documento novo. */
  initialDocument: string;
  editable?: boolean;
  dark?: boolean;
  foregroundColor?: string;
  primaryColor?: string;
  onDocumentChange?: (event: NativeSyntheticEvent<{ document: string }>) => void;
};

const NativeEditorCascadeView =
  Platform.OS === 'android'
    ? requireNativeView<EditorCascadeViewProps>('EditorCascade', 'EditorCascadeView')
    : null;

/** Cascade Editor (linreal) em Jetpack Compose (modules/editor-cascade). Só existe no Android. */
export function EditorCascadeView(props: EditorCascadeViewProps) {
  if (!NativeEditorCascadeView) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text variant="bodyM" className="text-center text-muted-foreground">
          O Cascade Editor só está disponível no Android.
        </Text>
      </View>
    );
  }
  return <NativeEditorCascadeView {...props} />;
}
