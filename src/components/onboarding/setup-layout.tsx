import { ScreenHeader, StepPill } from '@/components/ui/screen-header';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupLayoutProps = {
  title: string;
  step?: number;
  totalSteps?: number;
  footer?: React.ReactNode;
  onBack?: () => void;
  children: React.ReactNode;
  contentClassName?: string;
  footerClassName?: string;
};

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/welcome');
}


function SetupLayout({
  title,
  step,
  totalSteps = 2,
  footer,
  onBack = goBack,
  children,
  contentClassName,
  footerClassName,
}: SetupLayoutProps) {
  const insets = useSafeAreaInsets();
  // Com edge-to-edge o Android não encolhe a janela, e o teclado tapa o botão.
  // A barra de navegação é translúcida, por isso a altura inclui essa faixa.
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });
  const keyboardStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  return (
    <View className="flex-1 bg-card">
      <Animated.View style={[{ flex: 1 }, keyboardStyle]}>
        <ScreenHeader
          title={title}
          onBack={onBack}
          right={step ? <StepPill step={step} total={totalSteps} /> : undefined}
        />
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={cn(
            'w-full max-w-[640px] grow gap-5 self-center px-4 pb-6 pt-6',
            contentClassName
          )}
          contentContainerStyle={{
            paddingLeft: Math.max(insets.left, 16),
            paddingRight: Math.max(insets.right, 16),
          }}>
          {children}
        </ScrollView>
        {footer ? (
          <View
            className={cn('w-full max-w-[640px] self-center pt-3', footerClassName)}
            style={{
              paddingBottom: Math.max(insets.bottom, 32),
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
            }}>
            {footer}
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

export { goBack, SetupLayout };
export type { SetupLayoutProps };
