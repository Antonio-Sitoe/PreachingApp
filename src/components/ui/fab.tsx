import type { AppIconName } from '@/components/ui/app-icon';
import { IconButton, type IconButtonProps } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

type FabProps = Omit<IconButtonProps, 'variant' | 'icon'> & {
  icon?: AppIconName;

  floating?: boolean;

  containerClassName?: string;
};

function Fab({ icon = 'plus', floating = false, containerClassName, ...props }: FabProps) {
  const button = <IconButton icon={icon} variant="fab" {...props} />;

  if (!floating) return button;

  return (
    <SafeAreaView
      edges={{ bottom: Platform.OS === 'ios' }}
      style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' }]}>
      <View
        className={cn('flex-1 items-end justify-end p-4', containerClassName)}
        style={{ pointerEvents: 'box-none' }}>
        {button}
      </View>
    </SafeAreaView>
  );
}

export { Fab };
export type { FabProps };
