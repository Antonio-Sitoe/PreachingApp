import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEditorStore } from '../store';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';

import { Palette } from 'lucide-react-native';
import { ColorsPalette } from './colors-palette';
import { IconsSection } from './icons-section';
import { ActionsSection } from './actions';

export function EditorOptionsSheet() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { isOptionsBottomSheetOpen, set } = useEditorStore();

  return (
    <Actionsheet
      isOpen={isOptionsBottomSheetOpen}
      onClose={() => set({ isOptionsBottomSheetOpen: false })}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent className={isDark ? 'bg-gray-900' : 'bg-white'}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="w-full p-6">
          <View className="flex-row items-center mb-6 gap-2">
            <Palette
              size={24}
              color={isDark ? '#ffffff' : '#000000'}
              className="mr-3"
            />
            <Text
              className={`text-xl font-semibold font-title ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Opções da Anotação
            </Text>
          </View>

          <ColorsPalette />
          <IconsSection />
          <ActionsSection />
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
