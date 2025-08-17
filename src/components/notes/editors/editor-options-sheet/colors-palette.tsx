import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { VARIANT_COLORS } from '@/constants/variant-colors';

import { Check } from 'lucide-react-native';
import { useEditorStore } from '../store';
import useTheme from '@/hooks/useTheme';
import { notesActions } from '@/database/actions';
import { useCallback } from 'react';

export function ColorsPalette() {
  const store = useEditorStore();
  const { colorHex: backgroundColor, set, id } = store;
  const { isDark } = useTheme();

  const handleColorSelect = useCallback(
    async (color: string) => {
      set({ colorHex: color });

      if (id) {
        try {
          set({ isSaving: true });
          await notesActions.updateNote(id, { colorHex: color });
          set({ lastSaved: new Date(), isSaving: false });
          console.log('💾 Auto-salvo cor:', color);
        } catch (error) {
          console.error('❌ Erro ao salvar cor:', error);
          set({ isSaving: false });
        }
      }
    },
    [set, id]
  );

  const colorPairs: (typeof VARIANT_COLORS)[] = [];
  for (let i = 0; i < VARIANT_COLORS.length; i += 2) {
    colorPairs.push(VARIANT_COLORS.slice(i, i + 2));
  }

  const renderColorItem = (colorOption: (typeof VARIANT_COLORS)[0]) => {
    const isSelected =
      backgroundColor === (isDark ? colorOption.darkColor : colorOption.color);
    const displayColor = isDark ? colorOption.darkColor : colorOption.color;

    return (
      <TouchableOpacity
        key={colorOption.name}
        onPress={() => handleColorSelect(displayColor)}
        className="items-center mb-3"
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
            <Check size={20} color={isSelected ? '#ffffff' : 'transparent'} />
          )}
        </View>
        <Text
          className={`text-xs font-text ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {colorOption.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <Text
        className={`text-lg font-medium mb-4 font-title ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Cores de Fundo
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {colorPairs.map((pair, index) => (
          <View key={`column-${pair[0]?.name || index}`} className="mr-4">
            {pair.map(renderColorItem)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
