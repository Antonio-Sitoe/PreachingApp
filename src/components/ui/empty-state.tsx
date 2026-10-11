import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View, type ViewProps } from 'react-native';

type EmptyStateProps = ViewProps & {
  icon: AppIconName;
  title: string;
  description?: string;
  /** Texto do botão. Só aparece com `onActionPress`. */
  actionLabel?: string;
  onActionPress?: () => void;
};

/**
 * Estado vazio (canvas, artboard "Barra de navegação, folha inferior, estado vazio e aviso").
 *
 * @example
 * <EmptyState icon="people" title="Ainda não há pessoas"
 *   description="Regista a primeira pessoa que estás a acompanhar."
 *   actionLabel="Novo contacto" onActionPress={novo} />
 */
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <View className={cn('items-center gap-4 rounded-lg bg-card px-6 py-8', className)} {...props}>
      <View className="size-[72px] items-center justify-center rounded-full bg-secondary">
        <AppIcon name={icon} size={32} className="text-primary" />
      </View>
      <Text variant="titleM" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-muted-foreground">{description}</Text>
      ) : null}
      {actionLabel && onActionPress ? (
        <Button className="self-stretch" onPress={onActionPress}>
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}

export { EmptyState };
export type { EmptyStateProps };
