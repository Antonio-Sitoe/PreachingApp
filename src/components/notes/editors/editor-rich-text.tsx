import { View, Text } from 'react-native';
import { useCallback, useMemo, useEffect, useRef } from 'react';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import useTheme from '@/hooks/useTheme';
import { useEditorStore } from './store';
import { useThemeColor } from '@/hooks/useThemeColor';
import { adjustColorBrightness } from '@/utils/colors';
import { notesActions } from '@/database/actions';
import debounce from 'lodash.debounce';

export function EditorRichText() {
  const { isDark } = useTheme();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const store = useEditorStore();
  const { content, set, colorHex } = store;
  const richTextRef = useRef<RichEditor>(null);

  const toolbarBackgroundColor = colorHex || (isDark ? '#333' : '#e0e0e0');
  const selectedButtonColor = adjustColorBrightness(
    colorHex,
    isDark ? 30 : -30
  );

  const autoSaveContent = useCallback(
    async (content: string) => {
      if (content && store.id) {
        try {
          set({ isSaving: true });
          await notesActions.updateNote(store.id, {
            contentHtml: content,
          });
          set({ lastSaved: new Date(), isSaving: false });
          console.log(
            '💾 Auto-salvo no banco:',
            content.substring(0, 50) + '...'
          );
        } catch (error) {
          console.error('❌ Erro ao auto-salvar:', error);
          set({ isSaving: false });
        }
      }
    },
    [set, store.id]
  );

  const debouncedAutoSave = useMemo(
    () => debounce(autoSaveContent, 3000),
    [autoSaveContent]
  );

  useEffect(() => {
    if (content) {
      debouncedAutoSave(content);
    }
  }, [content, debouncedAutoSave]);

  return (
    <>
      <View className="flex-1">
        <RichEditor
          ref={richTextRef}
          initialContentHTML={content}
          onChange={(text: string) => {
            set({ content: text });
          }}
          placeholder="Comece a escrever..."
          style={{
            flex: 1,
            width: '100%',
          }}
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
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading3,
          actions.heading4,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.checkboxList,
        ]}
        iconMap={{
          [actions.heading3]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 16, fontWeight: 'bold' }]}
            >
              H1
            </Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text
              style={[{ color: tintColor, fontSize: 14, fontWeight: 'bold' }]}
            >
              H2
            </Text>
          ),
        }}
        style={{
          backgroundColor: toolbarBackgroundColor,
          borderTopColor: 'transparent',
          borderWidth: 0,
          maxWidth: '100%',
          borderRadius: 12,
          marginHorizontal: 24,
          marginBottom: 40,
          borderTopWidth: 0,
          height: 56,
        }}
        flatContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 6,
        }}
        selectedIconTint={'white'}
        iconTint={'white'}
        unselectedButtonStyle={{
          backgroundColor: 'transparent',
          minWidth: 40,
          minHeight: 40,
        }}
        selectedButtonStyle={{
          backgroundColor: selectedButtonColor,
          borderRadius: 8,
          minWidth: 40,
          minHeight: 40,
        }}
      />
    </>
  );
}
