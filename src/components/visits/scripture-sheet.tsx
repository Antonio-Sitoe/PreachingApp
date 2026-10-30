import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import * as React from 'react';
import { View } from 'react-native';

type ScriptureSheetProps = {
  open: boolean;
  onAdd: (text: string) => void;
  onClose: () => void;
};

function ScriptureSheet({ open, onAdd, onClose }: ScriptureSheetProps) {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    if (open) setText('');
  }, [open]);

  function add() {
    if (!text.trim()) return;
    onAdd(text.trim());
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text variant="titleL" className="text-center">
        Texto usado
      </Text>
      <TextField
        label="Texto"
        placeholder="Ex.: Salmo 37:29"
        value={text}
        onChangeText={setText}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={add}
        autoFocus
      />
      <View className="gap-1">
        <Button disabled={!text.trim()} onPress={add}>
          <Text>Adicionar</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>
    </BottomSheet>
  );
}

export { ScriptureSheet };
export type { ScriptureSheetProps };
