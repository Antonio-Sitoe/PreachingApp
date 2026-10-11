import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, Pressable, View, type ViewProps } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

type ToastAction = {
  label: string;
  onPress: () => void;
  icon?: AppIconName;
};

type ToastProps = ViewProps & {
  message: string;
  action?: ToastAction;
};

/**
 * Aviso (canvas, artboard "Barra de navegação, folha inferior, estado vazio e aviso").
 * Fundo escuro nos dois temas, mensagem em Corpo M e uma acção opcional ("Desfazer").
 * Este é só o desenho; para o mostrar por cima do ecrã usa `showToast`.
 */
function Toast({ message, action, className, ...props }: ToastProps) {
  return (
    <View
      role="status"
      aria-live="polite"
      className={cn(
        'min-h-14 flex-row items-center gap-3 rounded-lg bg-toast py-1.5 pl-4 pr-1.5',
        className
      )}
      {...props}>
      <Text className="flex-1 text-toast-foreground">{message}</Text>
      {action ? (
        <Pressable
          role="button"
          onPress={action.onPress}
          className={cn(
            'h-11 flex-row items-center gap-1.5 rounded-md px-3 active:opacity-70',
            Platform.select({ web: 'outline-none focus-visible:opacity-70' })
          )}>
          {action.icon ? (
            <AppIcon name={action.icon} size={18} className="text-toast-action" />
          ) : null}
          <Text variant="labelM" className="text-toast-action">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type ToastOptions = {
  message: string;
  action?: ToastAction;
  /** Tempo no ecrã em milissegundos. Por omissão 5000. */
  duration?: number;
};

type ToastState = {
  current: (ToastOptions & { id: number }) | null;
  show: (options: ToastOptions) => void;
  hide: () => void;
};

let nextId = 0;

const useToastStore = create<ToastState>((set) => ({
  current: null,
  show: (options) => set({ current: { ...options, id: ++nextId } }),
  hide: () => set({ current: null }),
}));

/**
 * Mostra um aviso por cima do ecrã. Um aviso novo substitui o anterior.
 *
 * @example
 * showToast({
 *   message: 'Visita marcada como feita',
 *   action: { label: 'Desfazer', icon: 'undo', onPress: desfazer },
 * });
 */
function showToast(options: ToastOptions) {
  useToastStore.getState().show(options);
}

function hideToast() {
  useToastStore.getState().hide();
}

type ToastHostProps = {
  /** Distância ao fundo do ecrã, para o aviso ficar por cima da barra de navegação. */
  bottomOffset?: number;
};

/** Ponto onde os avisos aparecem. Fica uma vez no layout raiz, depois do `<Stack />`. */
function ToastHost({ bottomOffset }: ToastHostProps) {
  const current = useToastStore((state) => state.current);
  const hide = useToastStore((state) => state.hide);
  const insets = useSafeAreaInsets();
  const onTabs = useSegments()[0] === '(tabs)';
  // Nas abas o aviso fica por cima da barra (~80 px). Fora delas, só a margem.

  React.useEffect(() => {
    if (!current) return;
    const timer = setTimeout(hide, current.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [current, hide]);

  if (!current) return null;

  const action = current.action;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center"
      style={{
        bottom: insets.bottom + (bottomOffset ?? (onTabs ? 96 : 16)),
        paddingLeft: Math.max(16, insets.left),
        paddingRight: Math.max(16, insets.right),
      }}>
      <Animated.View
        key={current.id}
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(150)}
        style={{ width: '100%', maxWidth: 640 }}>
        <Toast
          message={current.message}
          action={
            action
              ? {
                  ...action,
                  onPress: () => {
                    action.onPress();
                    hide();
                  },
                }
              : undefined
          }
        />
      </Animated.View>
    </View>
  );
}

export { hideToast, showToast, Toast, ToastHost };
export type { ToastAction, ToastOptions, ToastProps };
