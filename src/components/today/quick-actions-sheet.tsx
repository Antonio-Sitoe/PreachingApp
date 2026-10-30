import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

export type QuickAction = 'visit' | 'study' | 'contact' | 'hours';

const ACTIONS: readonly {
  id: QuickAction;
  icon: AppIconName;
  title: string;
  description: string;
}[] = [
  { id: 'visit', icon: 'today', title: 'Visita', description: 'O que conversaram e quando voltar' },
  { id: 'study', icon: 'book', title: 'Estudo', description: 'Visita com a lição do livro' },
  {
    id: 'contact',
    icon: 'person',
    title: 'Novo contacto',
    description: 'Nome, uma linha e a localização',
  },
  { id: 'hours', icon: 'clock', title: 'Horas', description: 'Cronómetro ou entrada à mão' },
];

type QuickActionsSheetProps = {
  open: boolean;
  onSelect: (action: QuickAction) => void;
  onClose: () => void;
};

function QuickActionsSheet({ open, onSelect, onClose }: QuickActionsSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text variant="titleL" className="text-center">
        O que queres registar?
      </Text>
      <View className="gap-2">
        {ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            role="button"
            onPress={() => onSelect(action.id)}
            className="min-h-16 flex-row items-center gap-3 rounded-lg border border-border py-3 pl-4 pr-3 active:bg-secondary">
            <View className="size-10 items-center justify-center rounded-full bg-secondary">
              <AppIcon name={action.icon} size={20} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <Text variant="titleS">{action.title}</Text>
              <Text variant="bodyS" className="text-muted-foreground">
                {action.description}
              </Text>
            </View>
            <AppIcon name="chevron-right" size={18} className="text-subtle" />
          </Pressable>
        ))}
      </View>
      <Button variant="ghost" className="min-h-12" onPress={onClose}>
        <Text>Cancelar</Text>
      </Button>
    </BottomSheet>
  );
}

export { QuickActionsSheet };
export type { QuickActionsSheetProps };
