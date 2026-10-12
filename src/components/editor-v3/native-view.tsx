import { Text } from '@/components/ui/text';
import { requireNativeView } from 'expo';
import type { Ref } from 'react';
import { Platform, View, type NativeSyntheticEvent, type ViewProps } from 'react-native';

/** Métodos do editor nativo (AsyncFunction em EditorV3Module.kt). */
export type EditorV3ViewRef = {
  /** Documento atual em JSON, sem esperar pelo debounce do onDocumentChange. */
  getDocument: () => Promise<string | null>;
};

export type EditorV3ViewProps = ViewProps & {
  ref?: Ref<EditorV3ViewRef>;
  /** Trocar o id reinicia o editor com o initialDocument; o resto do tempo o nativo é a fonte. */
  documentId: string;
  initialDocument: string;
  editable?: boolean;
  placeholder?: string;
  foregroundColor?: string;
  mutedColor?: string;
  primaryColor?: string;
  surfaceColor?: string;
  cardColor?: string;
  borderColor?: string;
  destructiveColor?: string;
  onDocumentChange?: (event: NativeSyntheticEvent<{ document: string }>) => void;
};

const NativeEditorV3View =
  Platform.OS === 'android'
    ? requireNativeView<EditorV3ViewProps>('EditorV3', 'EditorV3View')
    : null;

/** Editor em blocos feito em Jetpack Compose (modules/editor-v3). Só existe no Android. */
export function EditorV3View(props: EditorV3ViewProps) {
  if (!NativeEditorV3View) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text variant="bodyM" className="text-center text-muted-foreground">
          O editor v3 só está disponível no Android.
        </Text>
      </View>
    );
  }
  return <NativeEditorV3View {...props} />;
}
