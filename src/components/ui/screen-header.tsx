import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenHeaderProps = ViewProps & {
  title: string;
  /** Com esta função aparece o botão de voltar. */
  onBack?: () => void;
  backLabel?: string;
  /** Conteúdo à direita do título, por exemplo o `StepPill`. Ocupa 44 px. */
  right?: React.ReactNode;
};

/**
 * Cabeçalho dos ecrãs do canvas: voltar à esquerda, título centrado em Título L,
 * espaço de 44 px à direita e uma linha por baixo. Trata da área segura do topo.
 * Usa-se nos ecrãs que escondem o header do Stack (`headerShown: false`).
 */
function ScreenHeader({
  title,
  onBack,
  backLabel = 'Voltar',
  right,
  className,
  style,
  ...props
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('border-b border-border bg-card', className)}
      style={[
        {
          paddingTop: insets.top + 8,
          paddingLeft: Math.max(insets.left, 8),
          paddingRight: Math.max(insets.right, 8),
        },
        style,
      ]}
      {...props}>
      <View className="w-full max-w-[640px] flex-row items-center self-center pb-2">
        <View className="size-11">
          {onBack ? (
            <IconButton
              icon="chevron-left"
              variant="ghost"
              accessibilityLabel={backLabel}
              onPress={onBack}
            />
          ) : null}
        </View>
        <Text variant="titleL" numberOfLines={1} className="flex-1 text-center">
          {title}
        </Text>
        <View className="mr-2 min-w-11 items-center justify-center">{right}</View>
      </View>
    </View>
  );
}

type StepPillProps = {
  step: number;
  total: number;
};

/** Marcador de passo ("1/2") para o lado direito do cabeçalho. */
function StepPill({ step, total }: StepPillProps) {
  return (
    <View
      className="h-6 w-11 items-center justify-center rounded-full bg-secondary"
      accessibilityLabel={`Passo ${step} de ${total}`}
      accessible>
      <Text className="font-display-medium text-[13px] leading-6 text-primary-strong">
        {step}/{total}
      </Text>
    </View>
  );
}

export { ScreenHeader, StepPill };
export type { ScreenHeaderProps, StepPillProps };
