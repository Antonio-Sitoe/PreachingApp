import { completeOnboarding, isOnboardingCompleted, resetOnboarding } from '@/utils/storage';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Onboarding = {
  completed: boolean;
  complete: () => void;
  reset: () => void;
};

const OnboardingContext = createContext<Onboarding | null>(null);

function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState(isOnboardingCompleted);

  const complete = useCallback(() => {
    completeOnboarding();
    setCompleted(true);
  }, []);

  const reset = useCallback(() => {
    resetOnboarding();
    setCompleted(false);
  }, []);

  const value = useMemo(() => ({ completed, complete, reset }), [completed, complete, reset]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

function useOnboarding(): Onboarding {
  const value = useContext(OnboardingContext);
  if (!value) {
    throw new Error('useOnboarding tem de estar dentro de OnboardingProvider');
  }
  return value;
}

export { OnboardingProvider, useOnboarding };
