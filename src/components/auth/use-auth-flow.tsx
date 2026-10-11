import { useOnboarding } from '@/lib/onboarding';
import { LIGHT_THEME_VARS } from '@/lib/theme';
import { Redirect, router } from 'expo-router';
import * as React from 'react';

/**
 * O que os ecrãs de conta partilham: para onde ir no fim e para onde voltar.
 *
 * Os ecrãs de conta abrem-se em dois momentos:
 *   - na primeira abertura (boas-vindas, "Já tenho conta"), sempre em tema claro;
 *   - depois, a partir do app (Mais, Conta), no tema do telemóvel.
 */
function useAuthFlow() {
  const { completed, complete } = useOnboarding();
  const [finished, setFinished] = React.useState(false);

  /** A pessoa entrou: fecha a primeira abertura, se for o caso, e abre o app. */
  const finish = React.useCallback(() => {
    if (!completed) complete();
    setFinished(true);
  }, [completed, complete]);

  /** Sai dos ecrãs de conta sem entrar. */
  const leave = React.useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(completed ? '/' : '/welcome');
  }, [completed]);

  return {
    /** Põe este elemento no ecrã: depois de `finish()` redirecciona para o app. */
    redirect: finished ? <Redirect href="/" /> : null,
    finish,
    leave,
    /** Verdadeiro durante a primeira abertura, antes de a configuração estar concluída. */
    onboarding: !completed,
    /** Variáveis de tema para diálogos: claro na primeira abertura, o do telemóvel depois. */
    themeVars: completed ? undefined : LIGHT_THEME_VARS,
  };
}

export { useAuthFlow };
