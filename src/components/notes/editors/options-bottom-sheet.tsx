import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEditorStore, NOTE_COLORS } from './store';
import { Palette, Check } from 'lucide-react-native';

export function OptionsBottomSheet() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    isOptionsBottomSheetOpen,
    backgroundColor,
    setOptionsBottomSheetOpen,
    setBackgroundColor,
  } = useEditorStore();

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color);
    setOptionsBottomSheetOpen(false);
  };

  return (
    <Actionsheet
      isOpen={isOptionsBottomSheetOpen}
      onClose={() => setOptionsBottomSheetOpen(false)}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent className={isDark ? 'bg-gray-900' : 'bg-white'}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="w-full p-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Palette
              size={24}
              color={isDark ? '#ffffff' : '#000000'}
              className="mr-3"
            />
            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Opções da Anotação
            </Text>
          </View>

          {/* Colors Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-medium mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Cores de Fundo
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {NOTE_COLORS.map((colorOption) => {
                const isSelected =
                  backgroundColor ===
                  (isDark ? colorOption.darkColor : colorOption.color);
                const displayColor = isDark
                  ? colorOption.darkColor
                  : colorOption.color;

                return (
                  <TouchableOpacity
                    key={colorOption.name}
                    onPress={() => handleColorSelect(displayColor)}
                    className="items-center"
                  >
                    <View
                      className="w-12 h-12 rounded-full border-2 items-center justify-center mb-1"
                      style={{
                        backgroundColor: displayColor,
                        borderColor: isSelected
                          ? isDark
                            ? '#ffffff'
                            : '#000000'
                          : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <Check
                          size={20}
                          color={isSelected ? '#ffffff' : 'transparent'}
                        />
                      )}
                    </View>
                    <Text
                      className={`text-xs ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {colorOption.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Future Options */}
          <View
            className="border-t pt-4"
            style={{
              borderTopColor: isDark ? '#374151' : '#e5e7eb',
            }}
          >
            <ActionsheetItem
              onPress={() => {}}
              className={`py-4 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ActionsheetItemText
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                📎 Anexos (Em breve)
              </ActionsheetItemText>
            </ActionsheetItem>

            <ActionsheetItem
              onPress={() => {}}
              className={`py-4 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ActionsheetItemText
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                🏷️ Tags (Em breve)
              </ActionsheetItemText>
            </ActionsheetItem>

            <ActionsheetItem
              onPress={() => {}}
              className={`py-4 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ActionsheetItemText
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                🗑️ Excluir Anotação
              </ActionsheetItemText>
            </ActionsheetItem>
          </View>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
