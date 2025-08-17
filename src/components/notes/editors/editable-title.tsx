import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type {
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Text as ThemedText } from '@/components/Themed';
import { cortarString } from '@/utils/helper';

interface EditableTitleProps {
  initialValue: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  inputStyle?: TextStyle;
  placeholder?: string;
  multiline?: boolean;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export function EditableTitle({
  initialValue,
  onValueChange,
  style,
  textStyle,
  inputStyle,
  placeholder = 'Toque para editar...',
  multiline = false,
  type = 'title',
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'text');

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  const handlePress = () => {
    if (!isEditing) {
      setTempValue(value);
      setIsEditing(true);
    }
  };

  const handleConfirm = () => {
    if (isEditing) {
      const newValue = tempValue.trim();
      setValue(newValue);
      setIsEditing(false);

      if (onValueChange && newValue !== value) {
        onValueChange(newValue);
      }
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === 'Enter' && !multiline) {
      handleConfirm();
    }
  };

  if (isEditing) {
    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={inputRef}
          value={tempValue}
          onChangeText={setTempValue}
          onBlur={handleConfirm}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor={textColor + '70'} // 50% opacity
          multiline={multiline}
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
            inputStyle,
          ]}
          selectTextOnFocus
          autoCorrect={false}
          autoCapitalize="sentences"
        />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <ThemedText
        type={type}
        style={[styles.text, textStyle, !value.trim() && styles.placeholder]}
      >
        {value.trim() ? cortarString(value, 60) : placeholder}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 32,
    justifyContent: 'center',
  },
  text: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 20,
    fontWeight: '600',
    minHeight: 20,
    textAlignVertical: 'center',
    borderWidth: 0,
  },
  placeholder: {
    opacity: 0.2,
    fontSize: 20,
  },
});
