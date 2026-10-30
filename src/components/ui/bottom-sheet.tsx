import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { SHADOWS, THEME } from '@/lib/theme';
import { cn } from '@/utils/cn';
import {
  Host,
  ModalBottomSheet,
  RNHostView,
  type ModalBottomSheetRef,
} from '@expo/ui/jetpack-compose';
import { useColorScheme, useUnstableNativeVariable } from 'nativewind';
import * as React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SheetContent({ title, className, children, ...props }: ViewProps & { title?: string }) {
  return (
    <View className={cn('gap-4 px-5', className)} {...props}>
      {title ? <Text variant="titleL">{title}</Text> : null}
      {children}
    </View>
  );
}

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
      className={cn('gap-4 rounded-t-sheet bg-card pt-3', className)}
      style={[{ paddingBottom, boxShadow: SHADOWS.sheet }, style]}
      {...props}>
      <View className="h-1 w-9 self-center rounded-full bg-border" />
      <SheetContent title={title}>{children}</SheetContent>
    </View>
  );
}

function useCardColor() {
  const { colorScheme } = useColorScheme();
  const channels: unknown = useUnstableNativeVariable('--card');
  if (typeof channels === 'string' && channels.trim()) {
    return `rgb(${channels.trim().split(/\s+/).join(', ')})`;
  }
  return THEME[colorScheme ?? 'light'].card;
}

const SHEET_TOP_GAP = 48;

type BottomSheetProps = ViewProps & {
  title?: string;

  open: boolean;

  onClose: () => void;
};

function BottomSheet({ open, onClose, title, className, children, ...props }: BottomSheetProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const containerColor = useCardColor();
  // Sem limite, num ecrã pequeno a folha sobe até debaixo da barra de estado e a pega tapa o título.
  const maxHeight = height - insets.top - SHEET_TOP_GAP;
  const [contentHeight, setContentHeight] = React.useState<number>();
  const sheetRef = React.useRef<ModalBottomSheetRef>(null);
  const [mounted, setMounted] = React.useState(open);
  const [instance, setInstance] = React.useState(0);
  const openRef = React.useRef(open);
  openRef.current = open;
  const closing = React.useRef(false);

  React.useEffect(() => {
    if (open) {
      if (closing.current) {
        closing.current = false;
        setInstance((value) => value + 1);
      }
      setMounted(true);
      return;
    }
    const sheet = sheetRef.current;
    if (!sheet) {
      setMounted(false);
      return;
    }
    closing.current = true;
    sheet
      .hide()
      .catch(() => {})
      .finally(() => {
        if (openRef.current) return;
        closing.current = false;
        setMounted(false);
      });
  }, [open]);

  function handleDismiss() {
    setMounted(false);
    onClose();
  }

  if (!mounted) return null;

  return (
    <Host
      key={instance}
      style={{ position: 'absolute', width }}
      pointerEvents="none"
      colorScheme={colorScheme}>
      <ModalBottomSheet
        ref={sheetRef}
        onDismissRequest={handleDismiss}
        skipPartiallyExpanded
        containerColor={containerColor}
        scrimColor={SHADOWS.backdrop}>
        <RNHostView matchContents>
          <ScrollView
            style={{
              width,
              height: contentHeight === undefined ? undefined : Math.min(contentHeight, maxHeight),
            }}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            onContentSizeChange={(_width, nextHeight) => setContentHeight(nextHeight)}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <SheetContent aria-modal title={title} className={cn('pb-6', className)} {...props}>
              {children}
            </SheetContent>
          </ScrollView>
        </RNHostView>
      </ModalBottomSheet>
    </Host>
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
