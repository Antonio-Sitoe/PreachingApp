import { type AppIconName } from '@/components/ui/app-icon';
import { BottomSheet, SheetOption } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { insertBlock } from '@/components/notes/editors/commands';
import { useEditorStore } from '@/components/notes/editors/store';
import { View } from 'react-native';

type InsertType = 'heading' | 'bullet' | 'task' | 'scripture' | 'mention' | 'divider';

const INSERTS: { type: InsertType; icon: AppIconName; title: string; description: string }[] = [
  { type: 'heading', icon: 'heading', title: 'Título', description: 'Separa a nota em partes' },
  { type: 'bullet', icon: 'bullet-list', title: 'Lista', description: 'Pontos soltos, um por linha' },
  { type: 'task', icon: 'task-list', title: 'Lista de tarefas', description: 'Itens que podes marcar como feitos' },
  {
    type: 'scripture',
    icon: 'scripture',
    title: 'Texto bíblico',
    description: 'A referência em destaque, com o teu comentário',
  },
  { type: 'mention', icon: 'mention', title: 'Mencionar estudante', description: 'Liga a nota à ficha de alguém' },
  { type: 'divider', icon: 'divider', title: 'Separador', description: 'Uma linha entre dois assuntos' },
];

const SHORTCUTS = [
  ['#', 'título'],
  ['-', 'lista'],
  ['[]', 'tarefa'],
  ['@', 'estudante'],
] as const;

function InsertSheet() {
  const open = useEditorStore((state) => state.isInsertOpen);
  const set = useEditorStore((state) => state.set);

  function insert(type: InsertType) {
    if (type === 'mention') {
      const { focusedId } = useEditorStore.getState();
      set({ isInsertOpen: false, picker: { kind: 'mention', blockId: focusedId, at: null } });
      return;
    }
    set({ isInsertOpen: false });
    insertBlock(type);
  }

  return (
    <BottomSheet open={open} onClose={() => set({ isInsertOpen: false })} title="Inserir">
      <View className="gap-2">
        {INSERTS.map((item) => (
          <SheetOption
            key={item.type}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onPress={() => insert(item.type)}
          />
        ))}
      </View>
      <Text variant="bodyS" className="rounded-lg bg-muted px-3.5 py-3 text-[13px] leading-[19px] text-muted-foreground">
        Atalhos ao escrever:{' '}
        {SHORTCUTS.map(([key, label], index) => (
          <Text key={key} className="text-[13px] leading-[19px] text-muted-foreground">
            <Text className="font-sans-semibold text-[13px] leading-[19px] text-foreground">{key}</Text> {label}
            {index < SHORTCUTS.length - 1 ? ', ' : '.'}
          </Text>
        ))}
      </Text>
      <Button variant="ghost" onPress={() => set({ isInsertOpen: false })}>
        <Text>Cancelar</Text>
      </Button>
    </BottomSheet>
  );
}

export { InsertSheet };
