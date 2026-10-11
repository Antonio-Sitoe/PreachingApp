import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Platform, Pressable, View } from 'react-native';

type RadioProps = {
  selected: boolean;
  className?: string;
};

/** Círculo de escolha única, 20 px. Só o desenho: o toque é do componente pai. */
function Radio({ selected, className }: RadioProps) {
  return (
    <View
      className={cn(
        'size-5 items-center justify-center rounded-full border-[1.5px]',
        selected ? 'border-primary' : 'border-subtle',
        className
      )}>
      {selected ? <View className="size-2.5 rounded-full bg-primary" /> : null}
    </View>
  );
}

type OptionCardProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  icon: AppIconName;
  title: string;
  description?: string;
  selected: boolean;
};

/**
 * Cartão de escolha única (canvas, artboard "Configuração inicial 1 de 2":
 * "Como participas no ministério?"). Escolhido: contorno da marca e fundo suave.
 * Põe os cartões dentro de uma View com `role="radiogroup"`.
 */
function OptionCard({ icon, title, description, selected, className, ...props }: OptionCardProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      className={cn(
        'flex-row items-center gap-3.5 rounded-lg border px-4 py-3.5',
        selected
          ? 'border-[1.5px] border-primary bg-secondary'
          : 'border-border bg-card active:bg-secondary',
        Platform.select({
          web: 'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
        }),
        className
      )}
      {...props}>
      <View
        className={cn(
          'size-11 shrink-0 items-center justify-center rounded-full',
          selected ? 'bg-card' : 'bg-secondary'
        )}>
        <AppIcon name={icon} size={22} className="text-primary" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="titleS">{title}</Text>
        {description ? (
          <Text variant="bodyS" className="text-muted-foreground">
            {description}
          </Text>
        ) : null}
      </View>
      <Radio selected={selected} />
    </Pressable>
  );
}

export { OptionCard, Radio };
export type { OptionCardProps };
