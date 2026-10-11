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
import { Pressable, useWindowDimensions, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** O título e o conteúdo da folha, com o espaçamento do Design 2.0. */
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

/** A folha desenhada em React Native, sem a parte nativa. Só para pré-visualizar no catálogo. */
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

/** As variáveis do NativeWind vêm em canais ("255 255 255"). O Compose quer uma cor. */
function useCardColor() {
  const { colorScheme } = useColorScheme();
  const channels: unknown = useUnstableNativeVariable('--card');
  if (typeof channels === 'string' && channels.trim()) {
    return `rgb(${channels.trim().split(/\s+/).join(', ')})`;
  }
  return THEME[colorScheme ?? 'light'].card;
}

type BottomSheetProps = ViewProps & {
  title?: string;

  open: boolean;

  onClose: () => void;
};

/**
 * Folha inferior nativa (ModalBottomSheet do Material 3, via @expo/ui).
 * O Compose trata da animação, do gesto, do fundo escuro, da barra de navegação e do teclado.
 * A folha ajusta-se ao conteúdo: listas compridas vão dentro de um ScrollView com maxHeight.
 */
function BottomSheet({ open, onClose, title, className, children, ...props }: BottomSheetProps) {
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const containerColor = useCardColor();
  const sheetRef = React.useRef<ModalBottomSheetRef>(null);
  // A folha continua montada enquanto anima a saída.
  const [mounted, setMounted] = React.useState(open);
  // Muda quando a folha volta a abrir a meio da saída, para montar uma nova.
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
    // Fechada pelo ecrã (botão Cancelar, escolher uma opção): anima a saída antes de desmontar.
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

  // Fechada pela pessoa (arrastar para baixo, tocar fora, botão de voltar).
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
          <View style={{ width }}>
            <SheetContent aria-modal title={title} className={cn('pb-6', className)} {...props}>
              {children}
            </SheetContent>
          </View>
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
