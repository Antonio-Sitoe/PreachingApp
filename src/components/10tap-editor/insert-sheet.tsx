import { type AppIconName } from '@/components/ui/app-icon';
import { BottomSheet, SheetOption } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { EditorBridge } from '@10play/tentap-editor';
import { View } from 'react-native';

type InsertItem = {
  icon: AppIconName;
  title: string;
  description: string;
  run: (editor: EditorBridge) => void;
};

const INSERTS: InsertItem[] = [
  { icon: 'heading', title: 'Título', description: 'Separa a nota em partes', run: (editor) => editor.toggleHeading(2) },
  { icon: 'bullet-list', title: 'Lista', description: 'Pontos soltos, um por linha', run: (editor) => editor.toggleBulletList() },
  {
    icon: 'ordered-list',
    title: 'Lista numerada',
    description: 'Passos ou pontos por ordem',
    run: (editor) => editor.toggleOrderedList(),
  },
  {
    icon: 'task-list',
    title: 'Lista de tarefas',
    description: 'Itens que podes marcar como feitos',
    run: (editor) => editor.toggleTaskList(),
  },
  {
    icon: 'scripture',
    title: 'Citação',
    description: 'Um texto bíblico ou uma frase em destaque',
    run: (editor) => editor.toggleBlockquote(),
  },
  { icon: 'code', title: 'Código', description: 'Texto à parte, sem formatação', run: (editor) => editor.toggleCode() },
  { icon: 'edit', title: 'Sublinhado', description: 'Sublinha o texto seleccionado', run: (editor) => editor.toggleUnderline() },
];

type InsertSheetProps = {
  open: boolean;
  editor: EditorBridge;
  onClose: () => void;
};

function InsertSheet({ open, editor, onClose }: InsertSheetProps) {
  function insert(item: InsertItem) {
    onClose();
    // A folha tira o foco ao WebView: volta a focar onde estava o cursor antes de formatar.
    editor.focus(null);
    item.run(editor);
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Inserir">
      <View className="gap-2">
        {INSERTS.map((item) => (
          <SheetOption
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onPress={() => insert(item)}
          />
        ))}
      </View>
      <Button variant="ghost" onPress={onClose}>
        <Text>Cancelar</Text>
      </Button>
    </BottomSheet>
  );
}

export { InsertSheet };
