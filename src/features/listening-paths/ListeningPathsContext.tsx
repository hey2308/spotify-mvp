import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ListeningPathsContextValue {
  pathsDismissed: boolean;
  dismissPaths: () => void;
}

const ListeningPathsContext = createContext<ListeningPathsContextValue | null>(null);

export function ListeningPathsProvider({ children }: { children: ReactNode }) {
  const [pathsDismissed, setPathsDismissed] = useState(false);

  const dismissPaths = useCallback(() => {
    setPathsDismissed(true);
  }, []);

  const value = useMemo(
    () => ({ pathsDismissed, dismissPaths }),
    [pathsDismissed, dismissPaths],
  );

  return (
    <ListeningPathsContext.Provider value={value}>{children}</ListeningPathsContext.Provider>
  );
}

export function useListeningPathsSession(): ListeningPathsContextValue {
  const context = useContext(ListeningPathsContext);
  if (!context) {
    throw new Error('useListeningPathsSession must be used within ListeningPathsProvider');
  }
  return context;
}
