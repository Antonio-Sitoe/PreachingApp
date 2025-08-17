import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Plus, X, Loader2 } from 'lucide-react-native';
import { useEditorStore } from '../store';
import useTheme from '@/hooks/useTheme';
import { notesActions } from '@/database/actions';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TagsModal({ isOpen, onClose }: TagsModalProps) {
  const { set, tags, id } = useEditorStore();
  const { isDark } = useTheme();
  const [availableTags, setAvailableTags] = useState<any[]>([]);

  const [newTagText, setNewTagText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isRemovingTag, setIsRemovingTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const tags = await notesActions.getTags();
      setAvailableTags(tags || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      setAvailableTags([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen, loadTags]);

  const handleCloseTagsModal = () => {
    onClose();
    setNewTagText('');
    set({ tags: selectedTags });
  };

  const handleToggleTag = async (tag: string) => {
    if (!id) return;

    const isCurrentlySelected = selectedTags.includes(tag);

    if (isCurrentlySelected) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));

      try {
        await notesActions.removeTag(id, tag);
      } catch {
        setSelectedTags((prev) => [...prev, tag]);
        console.log('Erro', 'Não foi possível remover a etiqueta');
      }
    } else {
      setSelectedTags((prev) => [...prev, tag]);

      try {
        await notesActions.addTag(id, tag);
      } catch {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
        console.log('Erro', 'Não foi possível adicionar a etiqueta');
      }
    }
  };

  const handleAddNewTag = async () => {
    const value = newTagText.trim();
    if (!value || !id) return;

    if (availableTags.some((tag) => tag.name === value)) {
      console.log('Aviso', 'Esta etiqueta já existe');
      return;
    }

    setSelectedTags((prev) => [...prev, value]);
    setNewTagText('');
    setIsAddingTag(true);

    try {
      await notesActions.addTag(id, value);
      await loadTags();
    } catch {
      setSelectedTags((prev) => prev.filter((t) => t !== value));
      console.log('Erro', 'Não foi possível criar a etiqueta');
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!id) return;
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setIsRemovingTag(tagToRemove);

    try {
      await notesActions.removeTag(id, tagToRemove);
    } catch {
      setSelectedTags((prev) => [...prev, tagToRemove]);
    } finally {
      setIsRemovingTag(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseTagsModal}>
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
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      disabled={isRemovingTag === tag}
                    >
                      {isRemovingTag === tag ? (
                        <Loader2
                          size={14}
                          color={isDark ? '#ffffff' : '#15803d'}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={14} color={isDark ? '#ffffff' : '#15803d'} />
                      )}
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
                editable={!isAddingTag}
              />
              <TouchableOpacity
                onPress={handleAddNewTag}
                disabled={isAddingTag || !newTagText.trim()}
                className="px-4 py-3 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: isAddingTag
                    ? isDark
                      ? '#6b7280'
                      : '#9ca3af'
                    : isDark
                    ? '#16a34a'
                    : '#22c55e',
                }}
              >
                {isAddingTag ? (
                  <Loader2 size={16} color="#ffffff" className="animate-spin" />
                ) : (
                  <Plus size={16} color="#ffffff" />
                )}
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
            {isLoading ? (
              <View className="flex-row items-center justify-center py-4">
                <Loader2
                  size={20}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                  className="animate-spin"
                />
                <Text
                  className={`ml-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Carregando etiquetas...
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => handleToggleTag(tag.name)}
                      disabled={isRemovingTag === tag.name}
                      className="px-3 py-2 rounded-full border"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? '#16a34a'
                            : '#dcfce7'
                          : 'transparent',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        opacity: isRemovingTag === tag.name ? 0.6 : 1,
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
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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
  );
}
