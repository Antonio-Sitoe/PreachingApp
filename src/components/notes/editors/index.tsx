import { useThemeColor } from '@/hooks/useThemeColor';
import { EditorHeader } from '@/components/notes/editors/editor-header';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import useTheme from '@/hooks/useTheme';
import { EditorHeaderTitles } from './editor-header-titles';
import { SafeAreaView } from 'react-native-safe-area-context';

export function NotesEditor() {
  const { isDark } = useTheme();
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = isDark ? '#333' : '#e0e0e0';

  const [content, setContent] = useState(``);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const richTextRef = useRef<RichEditor>(null);

  const autoSaveContent = useCallback((content: string) => {
    if (content) {
      setLastSaved(new Date());
      console.log('💾 Auto-salvo:', content.substring(0, 50) + '...');
    }
  }, []);

  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSaveContent(content);
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, autoSaveContent]);

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor }]}>
      <EditorHeader />
      <EditorHeaderTitles lastSaved={lastSaved ?? new Date()} />

      <View style={styles.editorContainer}>
        <RichEditor
          ref={richTextRef}
          initialContentHTML={content}
          onChange={(text: string) => {
            setContent(text);
          }}
          style={styles.editor}
          placeholder="Comece a escrever..."
          editorStyle={{
            backgroundColor,
            color: textColor,
            cssText: `
              body { 
                background-color: ${backgroundColor}; 
                color: ${textColor}; 
                font-family: monospace; 
                font-size: 16px; 
                line-height: 1.5; 
                padding: 16px;
                margin: 0;
                min-height: 100vh;
              }
              * { box-sizing: border-box; }
            `,
          }}
          useContainer={false}
        />
      </View>

      <RichToolbar
        editor={richTextRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.blockquote,
          actions.code,
          actions.removeFormat,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 16, fontWeight: 'bold' }]}
            >
              H1
            </Text>
          ),
          [actions.heading2]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 14, fontWeight: 'bold' }]}
            >
              H2
            </Text>
          ),
        }}
        style={[
          styles.richToolbar,
          { backgroundColor, borderTopColor: borderColor, borderWidth: 1 },
        ]}
        flatContainerStyle={{
          paddingHorizontal: 12,
        }}
        selectedIconTint={tintColor}
        iconTint={textColor}
        unselectedButtonStyle={{
          backgroundColor: 'transparent',
        }}
        selectedButtonStyle={{
          backgroundColor: isDark ? '#333' : '#e0e0e0',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
    width: '100%',
  },
  richToolbar: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
