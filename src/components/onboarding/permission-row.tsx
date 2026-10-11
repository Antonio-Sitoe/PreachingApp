import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { PermissionStatus } from '@/lib/permissions';
import { View } from 'react-native';

type PermissionRowProps = {
  icon: AppIconName;
  title: string;
  description: string;
  status: PermissionStatus;
  /** Pedir a permissão ao telemóvel. */
  onRequest: () => void;
  /** Abrir as definições do telemóvel, quando a pessoa recusou de vez. */
  onOpenSettings: () => void;
};

/**
 * Linha de permissão (canvas, artboard "Configuração inicial 2 de 2").
 * À direita mostra "Permitido", o botão "Permitir" ou, se a pessoa recusou de vez, "Definições".
 */
function PermissionRow({
  icon,
  title,
  description,
  status,
  onRequest,
  onOpenSettings,
}: PermissionRowProps) {
  return (
    <View className="flex-row items-center gap-3.5 rounded-lg border border-border px-4 py-3.5">
      <View className="size-11 shrink-0 items-center justify-center rounded-full bg-secondary">
        <AppIcon name={icon} size={22} className="text-primary" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="titleS">{title}</Text>
        <Text variant="bodyS" className="text-muted-foreground">
          {description}
        </Text>
      </View>
      {status === 'granted' ? (
        <View className="h-7 shrink-0 justify-center rounded-full bg-success-soft px-2.5">
          <Text variant="labelS" className="text-success">
            Permitido
          </Text>
        </View>
      ) : null}
      {status === 'denied' ? (
        <Button
          variant="outline"
          size="sm"
          className="px-3.5"
          accessibilityLabel={`Permitir ${title.toLocaleLowerCase()}`}
          onPress={onRequest}>
          <Text>Permitir</Text>
        </Button>
      ) : null}
      {status === 'blocked' ? (
        <Button
          variant="outline"
          size="sm"
          className="px-3.5"
          accessibilityLabel={`Abrir as definições para permitir ${title.toLocaleLowerCase()}`}
          onPress={onOpenSettings}>
          <Text>Definições</Text>
        </Button>
      ) : null}
      {status === 'unavailable' ? (
        <View className="h-7 shrink-0 justify-center rounded-full bg-muted px-2.5">
          <Text variant="labelS" className="text-muted-foreground">
            Mais tarde
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export { PermissionRow };
export type { PermissionRowProps };
