import { Fab } from '@/components/ui/fab';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

/** Largura máxima do conteúdo. Em tablets o ecrã fica centrado em vez de esticar. */
export const CONTENT_MAX_WIDTH = 640;

type ScreenProps = {
  children: React.ReactNode;
  /**
   * Botão flutuante, alinhado ao canto do conteúdo (não à borda de um tablet).
   * Passa o `Fab` sem `floating`: o ecrã trata da posição.
   */
  fab?: React.ReactElement<React.ComponentProps<typeof Fab>>;
  /**
   * Áreas seguras. Num ecrã com header do Stack usa `['left', 'right']`,
   * porque o header já trata do topo.
   */
  edges?: readonly Edge[];
  contentClassName?: string;
};

/**
 * Ecrã com scroll que se adapta ao tamanho do dispositivo:
 * telemóvel estreito, paisagem (recortes laterais) e tablet (coluna centrada).
 */
function Screen({
  children,
  fab,
  edges = ['top', 'left', 'right'],
  contentClassName,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1 }} className="bg-background">
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={cn(
          'w-full max-w-[640px] grow self-center gap-6 px-4 pt-4',
          fab ? 'pb-28' : 'pb-8',
          contentClassName
        )}>
        {children}
      </ScrollView>
      {fab ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
          <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
            {React.cloneElement(fab, { floating: true })}
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export { Screen };
export type { ScreenProps };
