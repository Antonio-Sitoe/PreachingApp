import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { useToastStore, type ToastAction } from '@/hooks/use-toast';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastProps = ViewProps & {
  message: string;
  action?: ToastAction;
};

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
          className={'h-11 flex-row items-center gap-1.5 rounded-md px-3 active:opacity-70'}>
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

type ToastHostProps = {
  bottomOffset?: number;
};

function ToastHost({ bottomOffset }: ToastHostProps) {
  const current = useToastStore((state) => state.current);
  const hide = useToastStore((state) => state.hide);
  const insets = useSafeAreaInsets();
  const onTabs = useSegments()[0] === '(tabs)';

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

export { hideToast, showToast } from '@/hooks/use-toast';
export { Toast, ToastHost };
export type { ToastAction, ToastOptions } from '@/hooks/use-toast';
export type { ToastProps };
