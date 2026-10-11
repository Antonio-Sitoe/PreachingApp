import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

const TONES = {
  destructive: { bg: 'bg-destructive-soft', text: 'text-destructive' },
  warning: { bg: 'bg-warning-soft', text: 'text-warning' },
  success: { bg: 'bg-success-soft', text: 'text-success' },
  brand: { bg: 'bg-secondary', text: 'text-primary' },
} as const;

type AlertDialogProps = {
  open: boolean;

  onClose?: () => void;
  icon: AppIconName;
  tone?: keyof typeof TONES;
  title: string;
  description?: string;

  children: React.ReactNode;

  themeVars?: Record<string, string>;
};

function AlertDialog({
  open,
  onClose,
  icon,
  tone = 'destructive',
  title,
  description,
  children,
  themeVars,
}: AlertDialogProps) {
  const colors = TONES[tone];
  const titleId = React.useId();

  return (
    <Modal
      visible={open}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-3.5" style={themeVars}>
        <Animated.View entering={FadeIn.duration(150)} style={StyleSheet.absoluteFill}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
            accessible={false}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          entering={ZoomIn.duration(180)}
          style={{ width: '100%', maxWidth: 420 }}
          role="alertdialog"
          aria-modal
          aria-labelledby={titleId}>
          <View className="items-center gap-5 rounded-lg bg-card px-[22px] pb-6 pt-8">
            <View className={cn('size-14 items-center justify-center rounded-full', colors.bg)}>
              <AppIcon name={icon} size={28} className={colors.text} />
            </View>
            <View className="gap-2">
              <Text nativeID={titleId} variant="titleM" className="text-center">
                {title}
              </Text>
              {description ? (
                <Text className="text-center text-muted-foreground">{description}</Text>
              ) : null}
            </View>
            <View className="gap-1 self-stretch">{children}</View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export { AlertDialog };
export type { AlertDialogProps };
