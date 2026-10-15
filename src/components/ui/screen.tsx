import { Fab } from '@/components/ui/fab';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export const CONTENT_MAX_WIDTH = 640;

type ScreenProps = {
  children: React.ReactNode;

  fab?: React.ReactElement<React.ComponentProps<typeof Fab>>;

  edges?: readonly Edge[];
  contentClassName?: string;
};

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
