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

  const [content, setContent] = useState(``);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const richTextRef = useRef<RichEditor>(null);

  const autoSaveContent = useCallback((content: string) => {
    if (content) {
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
      <EditorHeaderTitles />

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
                padding: 0px 16px;
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
          actions.heading3,
          actions.heading4,
          actions.insertLine,
          actions.removeFormat,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.alignFull,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.checkboxList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.indent,
          actions.outdent,
          actions.undo,
          actions.redo,
          actions.code,
          actions.line,
          actions.blockquote,
          actions.keyboard,
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
          [actions.heading3]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 14, fontWeight: 'bold' }]}
            >
              H3
            </Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 14, fontWeight: 'bold' }]}
            >
              H4
            </Text>
          ),
        }}
        style={[
          styles.richToolbar,
          {
            backgroundColor: isDark ? '#333' : '#e0e0e0',
            borderTopColor: 'transparent',
            borderWidth: 0,
            maxWidth: '100%',
            borderRadius: 10,
            marginHorizontal: 24,
            marginBottom: 24,
          },
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
    borderTopWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
