import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';
import {
  useEditorStore,
  NOTE_COLORS,
  NOTE_ICONS,
  type IconName,
} from './store';
import {
  Palette,
  Check,
  X,
  BookOpen,
  FileText,
  PenTool,
  Lightbulb,
  Target,
  Heart,
  Star,
  Coffee,
  Music,
  Camera,
  Map as MapIcon,
  Bookmark,
  Calendar,
  Clock,
  Globe,
  Home,
  Briefcase,
  ShoppingCart,
  Gamepad2,
  Rocket,
  Share2,
  Trash2,
  Tag,
  Plus,
} from 'lucide-react-native';

// Icon component mapping
const IconComponents = {
  BookOpen,
  FileText,
  PenTool,
  Lightbulb,
  Target,
  Heart,
  Star,
  Coffee,
  Music,
  Camera,
  Map: MapIcon,
  Bookmark,
  Calendar,
  Clock,
  Globe,
  Home,
  Briefcase,
  ShoppingCart,
  Gamepad2,
  Rocket,
};

export function OptionsBottomSheet() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    isOptionsBottomSheetOpen,
    backgroundColor,
    iconName,
    title,
    content,
    tags,
    setTags,
    setOptionsBottomSheetOpen,
    setBackgroundColor,
    setIconName,
  } = useEditorStore();

  // Tags state
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);

  // Available tags (could be from a global store or API)
  const [availableTags, setAvailableTags] = useState([
    'Trabalho',
    'Pessoal',
    'Estudo',
    'Ideia',
    'Importante',
    'Urgente',
  ]);

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color);
    setOptionsBottomSheetOpen(false);
  };

  const handleIconSelect = (selectedIconName: IconName) => {
    setIconName(selectedIconName);
  };

  const handleRemoveIcon = () => {
    setIconName(null);
  };

  const handleShareAsText = async () => {
    try {
      // Clean HTML content for text sharing
      const cleanContent = content.replace(/<[^>]*>/g, '');
      const shareText = `${title}\n\n${cleanContent}`;

      const result = await Share.share({
        message: shareText,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        setOptionsBottomSheetOpen(false);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível partilhar como texto');
    }
  };

  const handleDeleteNote = () => {
    Alert.alert(
      'Eliminar Anotação',
      'Tem certeza que deseja eliminar esta anotação? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar eliminação da anotação
            setOptionsBottomSheetOpen(false);
            Alert.alert('Sucesso', 'Anotação eliminada com sucesso!');
          },
        },
      ]
    );
  };

  // Tags functions
  const handleOpenTagsModal = () => {
    setIsTagsModalOpen(true);
  };

  const handleCloseTagsModal = () => {
    setIsTagsModalOpen(false);
    setNewTagText('');
    // Persist to global store on close
    setTags(selectedTags);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNewTag = () => {
    const value = newTagText.trim();
    if (value && !availableTags.includes(value)) {
      setAvailableTags((prev) => [...prev, value]);
      setSelectedTags((prev) => [...prev, value]);
      setNewTagText('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
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

            {/* Icons Section */}
            <View className="mb-6">
              <Text
                className={`text-lg font-medium mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Ícones
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 4,
                  gap: 12,
                }}
              >
                {/* Remove Icon Button */}
                <TouchableOpacity
                  onPress={handleRemoveIcon}
                  className="items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full border-2 items-center justify-center mb-1"
                    style={{
                      backgroundColor:
                        iconName === null
                          ? isDark
                            ? '#374151'
                            : '#f3f4f6'
                          : 'transparent',
                      borderColor:
                        iconName === null
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
                    className={`text-xs ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Remover
                  </Text>
                </TouchableOpacity>

                {/* Icon Options */}
                {NOTE_ICONS.map((iconOption) => {
                  const IconComponent = IconComponents[iconOption];
                  const isSelected = iconName === iconOption;

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
                        <IconComponent
                          size={20}
                          color={isDark ? '#ffffff' : '#000000'}
                        />
                      </View>
                      <Text
                        className={`text-xs ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {iconOption}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View
              className="border-t pt-6"
              style={{
                borderTopColor: isDark ? '#374151' : '#e5e7eb',
              }}
            >
              <Text
                className={`text-lg font-medium mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Ações
              </Text>

              <View className="flex-row justify-start gap-6">
                {/* Tags Button */}
                <TouchableOpacity
                  onPress={handleOpenTagsModal}
                  className="items-center"
                >
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2 relative"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    }}
                  >
                    <Tag size={24} color={isDark ? '#ffffff' : '#000000'} />
                    {selectedTags.length > 0 && (
                      <View
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: isDark ? '#22c55e' : '#16a34a',
                        }}
                      >
                        <Text className="text-white text-xs font-bold">
                          {selectedTags.length}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Etiquetas
                  </Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity
                  onPress={handleShareAsText}
                  className="items-center"
                >
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    }}
                  >
                    <Share2 size={24} color={isDark ? '#ffffff' : '#000000'} />
                  </View>
                  <Text
                    className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Partilhar
                  </Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={handleDeleteNote}
                  className="items-center"
                >
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                    style={{
                      backgroundColor: isDark ? '#7f1d1d' : '#fef2f2',
                    }}
                  >
                    <Trash2 size={24} color={isDark ? '#ff6b6b' : '#dc2626'} />
                  </View>
                  <Text
                    className={`text-sm font-medium ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}
                  >
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>

      {/* Tags Modal */}
      <Modal isOpen={isTagsModalOpen} onClose={handleCloseTagsModal}>
        <ModalBackdrop />
        <ModalContent className={isDark ? 'bg-gray-900' : 'bg-white'}>
          <ModalHeader>
            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Gerenciar Etiquetas
            </Text>
            <ModalCloseButton onPress={handleCloseTagsModal}>
              <X size={20} color={isDark ? '#ffffff' : '#000000'} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <View className="mb-4">
                <Text
                  className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Etiquetas Selecionadas
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <View
                      key={tag}
                      className="flex-row items-center px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: isDark ? '#16a34a' : '#dcfce7',
                      }}
                    >
                      <Text
                        className={`text-sm font-medium mr-1 ${
                          isDark ? 'text-white' : 'text-green-700'
                        }`}
                      >
                        {tag}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                        <X size={14} color={isDark ? '#ffffff' : '#15803d'} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Add New Tag */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Adicionar Nova Etiqueta
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? '#374151' : '#f9fafb',
                    borderColor: isDark ? '#4b5563' : '#d1d5db',
                    color: isDark ? '#ffffff' : '#111827',
                  }}
                  placeholder="Nome da etiqueta"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={newTagText}
                  onChangeText={setNewTagText}
                />
                <TouchableOpacity
                  onPress={handleAddNewTag}
                  className="px-4 py-3 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: isDark ? '#16a34a' : '#22c55e',
                  }}
                >
                  <Plus size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Available Tags */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Etiquetas Disponíveis
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => handleToggleTag(tag)}
                      className="px-3 py-2 rounded-full border"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? '#16a34a'
                            : '#dcfce7'
                          : 'transparent',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected
                            ? isDark
                              ? 'text-white'
                              : 'text-green-700'
                            : isDark
                            ? 'text-gray-300'
                            : 'text-gray-600'
                        }`}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ModalBody>

          <ModalFooter>
            <TouchableOpacity
              onPress={handleCloseTagsModal}
              className="flex-1 py-3 rounded-lg items-center justify-center"
              style={{
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
              }}
            >
              <Text
                className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Concluído
              </Text>
            </TouchableOpacity>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
