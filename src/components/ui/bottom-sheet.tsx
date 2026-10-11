import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { SHADOWS } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetPanelProps = ViewProps & {
  title?: string;

  bottomInset?: number;
};

function BottomSheetPanel({
  title,
  bottomInset,
  className,
  style,
  children,
  ...props
}: BottomSheetPanelProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = bottomInset ?? Math.max(insets.bottom, 24);

  return (
    <View
      className={cn('gap-4 rounded-t-sheet bg-card px-5 pt-3', className)}
      style={[{ paddingBottom, boxShadow: SHADOWS.sheet }, style]}
      {...props}>
      <View className="h-1 w-9 self-center rounded-full bg-border" />
      {title ? <Text variant="titleL">{title}</Text> : null}
      {children}
    </View>
  );
}

type BottomSheetProps = Omit<BottomSheetPanelProps, 'bottomInset'> & {
  open: boolean;

  onClose: () => void;

  closeLabel?: string;
};

function BottomSheet({
  open,
  onClose,
  closeLabel = 'Fechar',
  children,
  ...props
}: BottomSheetProps) {
  return (
    <Modal
      visible={open}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: SHADOWS.backdrop }]}
            accessibilityLabel={closeLabel}
            role="button"
            onPress={onClose}
          />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', maxWidth: 640, alignSelf: 'center' }}>
          <Animated.View entering={SlideInDown.duration(240)}>
            <BottomSheetPanel aria-modal {...props}>
              {children}
            </BottomSheetPanel>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const OPTION_TONES = {
  success: { bg: 'bg-success-soft', text: 'text-success' },
  warning: { bg: 'bg-warning-soft', text: 'text-warning' },
  destructive: { bg: 'bg-destructive-soft', text: 'text-destructive' },
  brand: { bg: 'bg-secondary', text: 'text-primary' },
  neutral: { bg: 'bg-muted', text: 'text-muted-foreground' },
} as const;

type SheetOptionProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  icon: AppIconName;
  title: string;

  description?: string;
  tone?: keyof typeof OPTION_TONES;
};

function SheetOption({
  icon,
  title,
  description,
  tone = 'brand',
  className,
  ...props
}: SheetOptionProps) {
  const colors = OPTION_TONES[tone];
  return (
    <Pressable
      role="button"
      className={cn(
        'flex-row items-center gap-3 rounded-lg border border-border px-4 py-3.5 active:bg-secondary',
        Platform.select({
          web: 'outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring',
        }),
        className
      )}
      {...props}>
      <View className={cn('size-10 shrink-0 items-center justify-center rounded-full', colors.bg)}>
        <AppIcon name={icon} size={20} className={colors.text} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="titleS">{title}</Text>
        {description ? (
          <Text variant="bodyS" className="text-muted-foreground">
            {description}
          </Text>
        ) : null}
      </View>
      <AppIcon name="chevron-right" size={20} className="text-subtle" />
    </Pressable>
  );
}

export { BottomSheet, BottomSheetPanel, SheetOption };
export type { BottomSheetPanelProps, BottomSheetProps, SheetOptionProps };
