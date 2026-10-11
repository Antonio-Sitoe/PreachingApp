import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import type { Stage } from '@/constants/stages';
import { cn } from '@/lib/utils';
import { Platform, Pressable, View } from 'react-native';

type Tone = 'default' | 'warning';

type PersonCardProps = {
  name: string;
  stage: Stage;
  /** Linha por baixo do nome: "Lição 14 · levar a brochura", "Última visita há 16 dias". */
  detail?: string;
  /** `warning` para avisos na linha de detalhe: "Fora do ritmo há 2 dias". */
  detailTone?: Tone;
  /** Texto à direita do nome: a hora ("10:00") ou o atraso ("há 2 dias"). */
  meta?: string;
  /** `warning` quando a visita está em atraso. */
  metaTone?: Tone;
  /** Toque no cartão: abrir a ficha da pessoa. */
  onPress?: () => void;
  /** Com esta função o cartão mostra o botão do visto (marcar como feita ou adiar). */
  onActionPress?: () => void;
  actionLabel?: string;
  /** Sem `onActionPress`, mostra a seta de "abrir". Por omissão segue `onPress`. */
  showChevron?: boolean;
  className?: string;
};

/**
 * Cartão de pessoa (canvas, artboard "Cartão de pessoa"). Três usos:
 *
 * @example Visita de hoje
 * <PersonCard name="Celeste Nhantumbo" stage="regular" meta="10:00"
 *   detail="Lição 14 · levar a brochura" onPress={abrir} onActionPress={marcar} />
 *
 * @example Em atraso
 * <PersonCard name="Helena Macuácua" stage="revisit" meta="há 2 dias" metaTone="warning"
 *   detail="Ficou de ler Salmo 37:29" onPress={abrir} onActionPress={marcar} />
 *
 * @example Na lista de pessoas
 * <PersonCard name="Ernesto Sitoe" stage="revisit" detail="Última visita há 16 dias" onPress={abrir} />
 */
function PersonCard({
  name,
  stage,
  detail,
  detailTone = 'default',
  meta,
  metaTone = 'default',
  onPress,
  onActionPress,
  actionLabel = 'Marcar como feita ou adiar',
  showChevron,
  className,
}: PersonCardProps) {
  const chevron = !onActionPress && (showChevron ?? Boolean(onPress));

  return (
    <View className={cn('flex-row items-center rounded-lg bg-card py-3.5 pl-4 pr-3', className)}>
      <Pressable
        className={cn(
          'flex-1 flex-row items-center gap-3',
          onPress && 'active:opacity-70',
          Platform.select({ web: 'outline-none focus-visible:opacity-70' })
        )}
        role={onPress ? 'button' : undefined}
        disabled={!onPress}
        onPress={onPress}>
        <Avatar name={name} />
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row justify-between gap-2">
            <Text variant="titleS" numberOfLines={1} className="shrink">
              {name}
            </Text>
            {meta ? (
              <Text
                className={cn(
                  'font-display-medium text-[12px] leading-5',
                  metaTone === 'warning' ? 'text-warning' : 'text-muted-foreground'
                )}>
                {meta}
              </Text>
            ) : null}
          </View>
          {detail ? (
            <Text
              variant="bodyS"
              numberOfLines={2}
              className={
                detailTone === 'warning'
                  ? 'font-sans-semibold text-warning'
                  : 'text-muted-foreground'
              }>
              {detail}
            </Text>
          ) : null}
          <StageBadge stage={stage} />
        </View>
        {chevron ? <AppIcon name="chevron-right" size={20} className="mr-2 text-subtle" /> : null}
      </Pressable>
      {onActionPress ? (
        <IconButton
          icon="check"
          accessibilityLabel={`${actionLabel}: ${name}`}
          onPress={onActionPress}
          className="ml-3"
        />
      ) : null}
    </View>
  );
}

export { PersonCard };
export type { PersonCardProps };
