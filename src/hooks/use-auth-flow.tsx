import { useOnboarding } from '@/contexts/onboarding';
import { LIGHT_THEME_VARS } from '@/lib/theme';
import { Redirect, router } from 'expo-router';
import * as React from 'react';

function useAuthFlow() {
  const { completed, complete } = useOnboarding();
  const [finished, setFinished] = React.useState(false);

  const finish = React.useCallback(() => {
    if (!completed) complete();
    setFinished(true);
  }, [completed, complete]);

  const leave = React.useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(completed ? '/' : '/welcome');
  }, [completed]);

  return {
    redirect: finished ? <Redirect href="/" /> : null,
    finish,
    leave,
    onboarding: !completed,
    themeVars: completed ? undefined : LIGHT_THEME_VARS,
  };
}

export { useAuthFlow };
