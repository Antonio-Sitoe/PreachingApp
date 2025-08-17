import { useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { useEditorStore, type IconName } from '../store';

import useTheme from '@/hooks/useTheme';
import { notesActions } from '@/database/actions';
import { X } from 'lucide-react-native';
import {
  getIconCategoryLabel,
  NOTE_ICONS,
  type IconCategory,
} from '@/lib/icons/icon-registry';

export function IconsSection() {
  const store = useEditorStore();
  const { coverIcon, set, id } = store;
  const [selectedIconCategory, setSelectedIconCategory] =
    useState<keyof typeof NOTE_ICONS>('common');

  const { isDark } = useTheme();

  const autoSaveIcon = useCallback(
    async (iconName: IconName | null) => {
      if (id) {
        try {
          set({ isSaving: true });
          await notesActions.updateNote(id, { coverIcon: iconName });
          set({ lastSaved: new Date(), isSaving: false });
          console.log('💾 Auto-salvo ícone:', iconName);
        } catch (error) {
          console.error('❌ Erro ao salvar ícone:', error);
          set({ isSaving: false });
        }
      }
    },
    [id, set]
  );

  const handleIconSelect = useCallback(
    (selectedIconName: IconName) => {
      set({ coverIcon: selectedIconName });
      autoSaveIcon(selectedIconName);
    },
    [set, autoSaveIcon]
  );

  const handleRemoveIcon = useCallback(() => {
    set({ coverIcon: null });
    autoSaveIcon(null);
  }, [set, autoSaveIcon]);

  return (
    <View className="mb-6">
      <Text
        className={`text-lg font-title font-medium mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Ícones
      </Text>

      {/* Icon Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{
          paddingHorizontal: 4,
          gap: 8,
        }}
      >
        {Object.keys(NOTE_ICONS).map((category) => {
          const isSelected = selectedIconCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() =>
                setSelectedIconCategory(category as keyof typeof NOTE_ICONS)
              }
              className="px-3 py-2 rounded-full"
              style={{
                backgroundColor: isSelected
                  ? isDark
                    ? '#374151'
                    : '#e5e7eb'
                  : 'transparent',
                borderWidth: 1,
                borderColor: isSelected
                  ? isDark
                    ? '#ffffff'
                    : '#374151'
                  : isDark
                  ? '#4b5563'
                  : '#d1d5db',
              }}
            >
              <Text
                className={`text-xs font-text font-medium ${
                  isSelected
                    ? isDark
                      ? 'text-white'
                      : 'text-gray-900'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}
              >
                {getIconCategoryLabel(category as IconCategory)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Icon Grid */}
      <View className="flex-row flex-wrap gap-3">
        {/* Remove Icon Button */}
        <TouchableOpacity onPress={handleRemoveIcon} className="items-center">
          <View
            className="w-12 h-12 rounded-full border-2 items-center justify-center mb-1"
            style={{
              backgroundColor:
                coverIcon === null
                  ? isDark
                    ? '#374151'
                    : '#f3f4f6'
                  : 'transparent',
              borderColor:
                coverIcon === null
                  ? isDark
                    ? '#ffffff'
                    : '#000000'
                  : isDark
                  ? '#4b5563'
                  : '#d1d5db',
            }}
          >
            <X size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </View>
          <Text
            className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Remover
          </Text>
        </TouchableOpacity>

        {/* Icon Options for Selected Category */}
        {NOTE_ICONS[selectedIconCategory].map((iconOption) => {
          const isSelected = coverIcon === iconOption;

          return (
            <TouchableOpacity
              key={iconOption}
              onPress={() => handleIconSelect(iconOption)}
              className="items-center"
            >
              <View
                className="w-12 h-12 rounded-full border-2 items-center justify-center mb-1"
                style={{
                  backgroundColor: isSelected
                    ? isDark
                      ? '#374151'
                      : '#f3f4f6'
                    : 'transparent',
                  borderColor: isSelected
                    ? isDark
                      ? '#ffffff'
                      : '#000000'
                    : isDark
                    ? '#4b5563'
                    : '#d1d5db',
                }}
              >
                <Icon
                  name={iconOption}
                  size={20}
                  color={isDark ? '#ffffff' : '#000000'}
                />
              </View>
              <Text
                className={`text-xs font-text ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {iconOption.replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
