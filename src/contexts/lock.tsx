import { isLockEnabled } from '@/utils/storage';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Lock = {
  locked: boolean;
  unlock: () => void;
};

const LockContext = createContext<Lock | null>(null);

// Só se lê ao montar: o PIN pede-se ao abrir o app de raiz, não ao voltar do segundo plano.
function LockProvider({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(isLockEnabled);

  const unlock = useCallback(() => setLocked(false), []);

  const value = useMemo(() => ({ locked, unlock }), [locked, unlock]);

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}

function useLock(): Lock {
  const value = useContext(LockContext);
  if (!value) {
    throw new Error('useLock tem de estar dentro de LockProvider');
  }
  return value;
}

export { LockProvider, useLock };
